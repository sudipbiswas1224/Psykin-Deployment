require('dotenv').config();
const mongoose = require('mongoose');
const mongooseConnect = require('../config/db');
const Resource = require('../models/Resource');

const seedResources = async () => {
    try {
        await mongooseConnect();

        // Clear existing
        await Resource.deleteMany();

        const resources = [
            {
                title: "Depression - National Institute of Mental Health",
                description: "Official NIMH resource on depression, including symptoms, causes, and treatment options.",
                url: "https://www.nimh.nih.gov/health/topics/depression",
                type: "article",
                tags: ["depression", "phq9", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Anxiety Disorders - National Institute of Mental Health",
                description: "Official NIMH overview of anxiety disorders, symptoms, and treatment approaches.",
                url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
                type: "article",
                tags: ["anxiety", "gad7", "stress", "pss", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Caring for Your Mental Health",
                description: "NIMH self-care guidance covering sleep, relaxation, healthy routines, and recovery support.",
                url: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
                type: "article",
                tags: ["wellbeing", "who5", "stress", "pss", "sleep", "insomnia", "isi", "anxiety", "gad7", "depression", "phq9"],
                targetSeverity: "all"
            },
            {
                title: "Mental well-being: resources for the public",
                description: "WHO public resource page with practical mental well-being and stress-reduction support.",
                url: "https://www.who.int/news-room/feature-stories/mental-well-being-resources-for-the-public",
                type: "article",
                tags: ["wellbeing", "who5", "stress", "pss", "anxiety", "gad7"],
                targetSeverity: "all"
            },
            {
                title: "Mental health",
                description: "WHO overview page defining mental health as mental well-being and linking public resources.",
                url: "https://www.who.int/health-topics/mental-health",
                type: "article",
                tags: ["wellbeing", "who5", "stress", "pss", "depression", "phq9", "anxiety", "gad7"],
                targetSeverity: "all"
            },
            {
                title: "Mental Health and Wellbeing",
                description: "UN mental health and wellbeing page that highlights practical stress-management and mindfulness resources.",
                url: "https://www.un.org/en/global-issues/mental-health",
                type: "article",
                tags: ["wellbeing", "who5", "stress", "pss", "anxiety", "gad7"],
                targetSeverity: "all"
            },
            {
                title: "What is anxiety? mental health minute with Kati Morton",
                description: "A short educational video explaining what anxiety is and how it may feel.",
                url: "https://www.youtube.com/watch?v=2oFZfe89VDU",
                type: "video",
                tags: ["anxiety", "gad7", "stress", "pss"],
                targetSeverity: "mild"
            },
            {
                title: "7 Proven Ways To Manage Anxiety",
                description: "A practical coping-skills video for anxiety that also supports stress reduction.",
                url: "https://www.youtube.com/watch?v=whrN7ujh3Yk",
                type: "video",
                tags: ["anxiety", "gad7", "stress", "pss", "wellbeing", "who5"],
                targetSeverity: "moderate"
            },
            {
                title: "What to do with Anxiety in Your Body",
                description: "Body-based coping guidance for physical anxiety symptoms that can also help stress regulation.",
                url: "https://www.youtube.com/watch?v=-v34YfjfKUk&vl=en",
                type: "video",
                tags: ["anxiety", "gad7", "stress", "pss", "sleep", "insomnia", "isi"],
                targetSeverity: "moderate"
            },
            {
                title: "Having a Panic Attack? The Anti-Struggle Technique",
                description: "A guided support video for panic symptoms and intense anxiety episodes.",
                url: "https://www.youtube.com/watch?v=2CQpyA485wc&vl=en",
                type: "video",
                tags: ["anxiety", "gad7", "stress", "pss"],
                targetSeverity: "severe"
            },
            {
                title: "Depression, Anxiety and WHAT IS NORMAL",
                description: "A psychoeducational video about common emotional symptoms and when they may need attention.",
                url: "https://www.youtube.com/watch?v=U4JmP59SwRs",
                type: "video",
                tags: ["depression", "phq9", "anxiety", "gad7", "wellbeing", "who5"],
                targetSeverity: "mild"
            },
            {
                title: "How Your Anxiety May Lead to Depression",
                description: "Explains the overlap between anxiety and depression and how one can affect the other.",
                url: "https://www.youtube.com/watch?v=jGCyQcvfsBQ",
                type: "video",
                tags: ["anxiety", "gad7", "depression", "phq9", "stress", "pss"],
                targetSeverity: "moderate"
            },
            {
                title: "Can You Fully Recover From Depression?",
                description: "A recovery-focused depression video that may support hope and treatment engagement.",
                url: "https://www.youtube.com/watch?v=3r1vz2ML-HI",
                type: "video",
                tags: ["depression", "phq9", "wellbeing", "who5"],
                targetSeverity: "severe"
            },
            {
                title: "Get Stress & Anxiety Relief with These Effective Ways to Reduce Stress",
                description: "A stress-reduction video that also addresses anxiety relief strategies.",
                url: "https://www.youtube.com/watch?v=YXhdbsa7HkA",
                type: "video",
                tags: ["stress", "pss", "anxiety", "gad7", "wellbeing", "who5"],
                targetSeverity: "moderate"
            },
            {
                title: "Progressive Muscle Relaxation Script",
                description: "A structured relaxation exercise for tension release, stress reduction, and calming the body.",
                url: "https://www.therapistaid.com/therapy-worksheet/progressive-muscle-relaxation-script",
                type: "activity",
                tags: ["stress", "pss", "anxiety", "gad7", "sleep", "insomnia", "isi", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Progressive Muscle Relaxation Exercise",
                description: "A Therapist Aid guided PMR exercise that supports stress relief and physical relaxation.",
                url: "https://www.therapistaid.com/therapy-video/progressive-muscle-relaxation",
                type: "activity",
                tags: ["stress", "pss", "anxiety", "gad7", "sleep", "insomnia", "isi", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Mindfulness exercises",
                description: "Mayo Clinic mindfulness practices that may support general well-being, stress relief, and sleep quality.",
                url: "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/mindfulness-exercises/art-20046356",
                type: "activity",
                tags: ["wellbeing", "who5", "stress", "pss", "sleep", "insomnia", "isi", "anxiety", "gad7"],
                targetSeverity: "all"
            },
            {
                title: "A Body Scan Meditation to Prepare Mind and Body for Sleep",
                description: "A body scan practice that helps with winding down, relaxation, and sleep preparation.",
                url: "https://www.mindful.org/a-body-scan-meditation-to-help-you-sleep/",
                type: "activity",
                tags: ["sleep", "insomnia", "isi", "stress", "pss", "anxiety", "gad7", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Guided Body Scan Meditation for Sleep",
                description: "A guided meditation for calming the body and supporting sleep readiness.",
                url: "https://www.youtube.com/watch?v=kPtVGqaMJAk",
                type: "activity",
                tags: ["sleep", "insomnia", "isi", "stress", "pss", "anxiety", "gad7", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Progressive Muscle Relaxation for Sleep | Full-Body Guided Meditation to Release Tension",
                description: "A guided PMR meditation designed for sleep, tension release, and nervous-system calming.",
                url: "https://www.youtube.com/watch?v=kG3_bGadSJQ",
                type: "activity",
                tags: ["sleep", "insomnia", "isi", "stress", "pss", "anxiety", "gad7", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Progressive Muscular Relaxation Guided Sleep Meditation for Anxiety & Insomnia Relief at Bedtime",
                description: "A bedtime relaxation practice aimed at insomnia, anxiety reduction, and deep physical calming.",
                url: "https://www.youtube.com/watch?v=y1TOqzOWV3M",
                type: "activity",
                tags: ["sleep", "insomnia", "isi", "anxiety", "gad7", "stress", "pss", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "FALL INTO SLEEP INSTANTLY Healing of Stress, Anxiety and Depressive States INSOMNIA RELIEF",
                description: "Relaxation music intended to support sleep onset and reduce anxious or stressed arousal.",
                url: "https://www.youtube.com/watch?v=i9sR_T76H34",
                type: "music",
                tags: ["sleep", "insomnia", "isi", "stress", "pss", "anxiety", "gad7", "depression", "phq9", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Beautiful Relaxing Music for Stress Relief ~ Calming Music",
                description: "Calming music that can be used for relaxation, stress reduction, and general emotional settling.",
                url: "https://www.youtube.com/watch?v=lFcSrYw-ARY",
                type: "music",
                tags: ["stress", "pss", "sleep", "insomnia", "isi", "wellbeing", "who5", "anxiety", "gad7"],
                targetSeverity: "all"
            },
            {
                title: "Free 24x7 Mental Health Counselling - Vandrevala Foundation",
                description: "A 24x7 mental health support and counselling resource in India that can be surfaced for higher-risk cases.",
                url: "https://www.vandrevalafoundation.com/free-counseling",
                type: "article",
                tags: ["depression", "phq9", "anxiety", "gad7", "stress", "pss", "wellbeing", "who5", "sleep", "insomnia", "isi"],
                targetSeverity: "severe"
            },
            {
                title: "Every Mind Matters",
                description: "NHS self-help hub for people who feel stressed, anxious, low, or unable to sleep.",
                url: "https://www.nhs.uk/every-mind-matters/",
                type: "article",
                tags: ["stress", "pss", "anxiety", "gad7", "depression", "phq9", "sleep", "insomnia", "isi", "wellbeing", "who5"],
                targetSeverity: "all"
            },
            // --- WHO-5 Wellbeing specific resources ---
            {
                title: "WHO-5 Well-Being Index",
                description: "Official information on the WHO-5 Well-Being Index questionnaire, its scoring, and what the results mean.",
                url: "https://www.psykiatri-regionh.dk/who-5/Pages/default.aspx",
                type: "article",
                tags: ["wellbeing", "who5"],
                targetSeverity: "all"
            },
            {
                title: "Five Steps to Mental Wellbeing",
                description: "NHS guidance on five evidence-based actions shown to improve mental wellbeing and life satisfaction.",
                url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/",
                type: "article",
                tags: ["wellbeing", "who5", "stress", "pss"],
                targetSeverity: "all"
            },
            {
                title: "Wellbeing check-in: low mood and next steps",
                description: "NHS Every Mind Matters guidance for people whose wellbeing score suggests low mood, with clear next-step options.",
                url: "https://www.nhs.uk/every-mind-matters/mental-health-issues/low-mood-and-depression/",
                type: "article",
                tags: ["wellbeing", "who5", "depression", "phq9"],
                targetSeverity: "severe"
            },

            // --- ISI / Insomnia - CBT-I focused (evidence-based first-line treatment) ---
            {
                title: "Cognitive Behavioural Therapy for Insomnia (CBT-I) Self-Help Guide",
                description: "NHS self-help guide covering CBT-I, the evidence-based first-line treatment for chronic insomnia.",
                url: "https://www.nhs.uk/every-mind-matters/mental-health-issues/sleep/",
                type: "article",
                tags: ["sleep", "insomnia", "isi"],
                targetSeverity: "all"
            },
            {
                title: "Insomnia - National Institute of Neurological Disorders",
                description: "Overview of insomnia causes, symptoms, and treatment options from a US federal health institute.",
                url: "https://www.ninds.nih.gov/health-information/disorders/insomnia",
                type: "article",
                tags: ["sleep", "insomnia", "isi"],
                targetSeverity: "moderate"
            },
            {
                title: "Sleep Hygiene Tips",
                description: "CDC guidance on sleep hygiene practices that support consistent, restorative sleep.",
                url: "https://www.cdc.gov/sleep/about/index.html",
                type: "article",
                tags: ["sleep", "insomnia", "isi", "wellbeing", "who5"],
                targetSeverity: "all"
            },

            // --- PSS / Stress - dedicated management resources ---
            {
                title: "Stress Management",
                description: "APA overview of stress management strategies, covering causes, effects, and coping techniques.",
                url: "https://www.apa.org/topics/stress",
                type: "article",
                tags: ["stress", "pss"],
                targetSeverity: "all"
            },
            {
                title: "Coping with Stress",
                description: "CDC guidance on recognizing signs of stress and practical, evidence-informed coping strategies.",
                url: "https://www.cdc.gov/mental-health/living-with/coping-with-stress.html",
                type: "article",
                tags: ["stress", "pss", "wellbeing", "who5"],
                targetSeverity: "moderate"
            },
            {
                title: "How to manage stress",
                description: "NHS guidance specifically for high, persistent stress, including when to seek further support.",
                url: "https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/",
                type: "article",
                tags: ["stress", "pss"],
                targetSeverity: "severe"
            }
        ];

        await Resource.insertMany(resources);
        console.log('Resources Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding resources:', error);
        process.exit(1);
    }
};

// Allow running directly via CLI (e.g. `node seedResources.js`) 
if (require.main === module) {
    seedResources();
}

// Export it so it can be imported in other files
module.exports = seedResources;
