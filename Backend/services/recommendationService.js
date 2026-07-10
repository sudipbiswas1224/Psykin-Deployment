const AssessmentResult = require('../models/AssessmentResult');
const Resource = require('../models/Resource');

const TEST_TYPES = ['phq9', 'gad7', 'pss', 'who5', 'isi'];

const mapTestTypeToTags = (testType) => {
    const map = {
        'phq9': ['depression', 'phq9'],
        'gad7': ['anxiety', 'gad7'],
        'pss': ['stress', 'pss'],
        'who5': ['wellbeing', 'who5'],
        'isi': ['sleep', 'insomnia', 'isi']
    };
    return map[testType.toLowerCase()] || [];
};

/**
 * Per-test-type severity mapping, since each assessment uses different
 * interpretation vocabulary. Normalizes everything to 'mild' | 'moderate' | 'severe'.
 */
const SEVERITY_MAP = {
    phq9: (s) => {
        if (s.includes('severe')) return 'severe'; // covers "severe" and "moderately severe"
        if (s.includes('moderate')) return 'moderate';
        return 'mild'; // minimal / mild
    },
    gad7: (s) => {
        if (s.includes('severe')) return 'severe';
        if (s.includes('moderate')) return 'moderate';
        return 'mild';
    },
    pss: (s) => {
        if (s.includes('high')) return 'severe';
        if (s.includes('moderate')) return 'moderate';
        return 'mild'; // low stress
    },
    who5: (s) => {
        // WHO-5 is usually reported as a % or raw score; interpretation
        // strings commonly used: "Poor wellbeing", "Below average", "Good", "Excellent"
        if (s.includes('poor')) return 'severe';
        if (s.includes('ok wellbeing')) return 'moderate';
        return 'mild'; // average / good / excellent
    },
    isi: (s) => {
        if (s.includes('severe')) return 'severe';
        if (s.includes('moderate')) return 'moderate';
        return 'mild'; // no significant / subthreshold
    }
};

const mapSeverity = (testType, interpretation) => {
    if (!interpretation) return 'mild';
    const s = interpretation.toLowerCase();
    const mapper = SEVERITY_MAP[testType.toLowerCase()];
    return mapper ? mapper(s) : 'mild';
};

const SEVERITY_WEIGHT = { severe: 3, moderate: 2, mild: 1, all: 0 };

exports.getRecommendationsForUser = async (userId) => {
    try {
        // Fetch the latest result for EACH test type the user has taken,
        // not just the single latest result overall.
        const latestPerType = await Promise.all(
            TEST_TYPES.map(testType =>
                AssessmentResult.findOne({ userId, testType })
                    .sort({ date: -1 })
                    .exec()
            )
        );

        const takenResults = latestPerType.filter(Boolean);

        let recommendations = [];

        if (takenResults.length === 0) {
            // No assessments taken yet — general wellbeing defaults
            recommendations = await Resource.find({
                tags: { $in: ['wellbeing', 'who5'] },
                targetSeverity: 'all'
            }).limit(10).exec();
        } else {
            // Build one query per taken test, so each test's tags/severity
            // are matched together (not cross-contaminated with another test's tags)
            const perTestQueries = takenResults.map(result => {
                const tags = mapTestTypeToTags(result.testType);
                const severity = mapSeverity(result.testType, result.interpretation);
                return { tags, severity, testType: result.testType.toLowerCase() };
            });

            const orConditions = perTestQueries.map(({ tags, severity }) => ({
                tags: { $in: tags },
                targetSeverity: { $in: [severity, 'all'] }
            }));

            const rawResults = await Resource.find({ $or: orConditions })
                .limit(50) // over-fetch, then rank + trim
                .exec();

            // Score each resource: tag overlap count + severity match weight
            const scored = rawResults.map(resource => {
                let score = 0;
                perTestQueries.forEach(({ tags, severity }) => {
                    const overlap = resource.tags.filter(t => tags.includes(t)).length;
                    if (overlap > 0) {
                        score += overlap;
                        if (resource.targetSeverity === severity) {
                            score += SEVERITY_WEIGHT[severity] || 0;
                        }
                    }
                });
                return { resource, score };
            });

            scored.sort((a, b) => b.score - a.score);

            // De-duplicate by resource _id (a resource could match multiple test queries)
            const seen = new Set();
            recommendations = [];
            for (const { resource } of scored) {
                const id = resource._id.toString();
                if (!seen.has(id)) {
                    seen.add(id);
                    recommendations.push(resource);
                }
                if (recommendations.length >= 10) break;
            }

            // Safety net: if any taken test scored 'severe', make sure at least
            // one severe-targeted resource is guaranteed in the final list
            const hasSevere = perTestQueries.some(q => q.severity === 'severe');
            const hasSevereResource = recommendations.some(r => r.targetSeverity === 'severe');
            if (hasSevere && !hasSevereResource) {
                const severeResource = await Resource.findOne({ targetSeverity: 'severe' }).exec();
                if (severeResource) recommendations.unshift(severeResource);
            }
        }

        const grouped = {
            videos: recommendations.filter(r => r.type === 'video'),
            articles: recommendations.filter(r => r.type === 'article'),
            activities: recommendations.filter(r => r.type === 'activity'),
            music: recommendations.filter(r => r.type === 'music')
        };

        return grouped;

    } catch (error) {
        console.error('Recommendation Service Error:', error);
        throw error;
    }
};