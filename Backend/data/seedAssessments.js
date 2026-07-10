const mongoose = require('mongoose');
const AssessmentTestTemplate = require('../models/AssessmentTestTemplate');
const connectDB = require('../config/db');



async function seedAssessments() {
  // patient health questionaries 
  const phq9 = {
    name: 'phq9',
    questions: [
      { text: 'Little interest or pleasure in doing things?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Feeling down, depressed, or hopeless?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Trouble falling or staying asleep, or sleeping too much?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Feeling tired or having little energy?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Poor appetite or overeating?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Trouble concentrating on things, such as reading the newspaper or watching television?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Thoughts that you would be better off dead or of hurting yourself in some way?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] }
    ],
    scoringLogic: 'phq9'
  };


  // general anxiety disorder ->  anxiety questionaires
  const gad7 = {
    name: 'gad7',
    questions: [
      { text: 'Feeling nervous, anxious, or on edge?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Not being able to stop or control worrying?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Worrying too much about different things?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Trouble relaxing?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Being so restless that it is hard to sit still?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Becoming easily annoyed or irritable?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] },
      { text: 'Feeling afraid as if something awful might happen?', choices: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], scores: [0, 1, 2, 3] }
    ],
    scoringLogic: 'gad7'
  };

  // perseived stress test -> stress questionaires
  const pss = {
    name: 'pss',
    questions: [
      { text: 'In the last month, how often have you been upset because of something that happened unexpectedly?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] },
      { text: 'In the last month, how often have you felt that you were unable to control the important things in your life?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] },
      { text: 'In the last month, how often have you felt nervous and stressed?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] },
      { text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [4, 3, 2, 1, 0] },
      { text: 'In the last month, how often have you felt that things were going your way?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [4, 3, 2, 1, 0] },
      { text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] },
      { text: 'In the last month, how often have you been able to control irritations in your life?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [4, 3, 2, 1, 0] },
      { text: 'In the last month, how often have you felt that you were on top of things?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [4, 3, 2, 1, 0] },
      { text: 'In the last month, how often have you been angered because of things that were outside of your control?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] },
      { text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?', choices: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], scores: [0, 1, 2, 3, 4] }
    ],
    scoringLogic: 'pss'
  };

  // wellbeing questionaires
  const who5 = {
    name: 'who5',
    questions: [
      { text: 'I have felt cheerful and in good spirits.', choices: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'], scores: [0, 1, 2, 3, 4, 5] },
      { text: 'I have felt calm and relaxed.', choices: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'], scores: [0, 1, 2, 3, 4, 5] },
      { text: 'I have felt active and vigorous.', choices: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'], scores: [0, 1, 2, 3, 4, 5] },
      { text: 'I woke up feeling fresh and rested.', choices: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'], scores: [0, 1, 2, 3, 4, 5] },
      { text: 'My daily life has been filled with things that interest me.', choices: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'], scores: [0, 1, 2, 3, 4, 5] }
    ],
    scoringLogic: 'who5'
  };


  // isomnia severity index( sleep related questionaires)
  const isi = {
    name: 'isi',
    questions: [
      { text: 'Difficulty falling asleep', choices: ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'], scores: [0, 1, 2, 3, 4] },
      { text: 'Difficulty staying asleep', choices: ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'], scores: [0, 1, 2, 3, 4] },
      { text: 'Problems waking up too early', choices: ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'], scores: [0, 1, 2, 3, 4] },
      { text: 'How satisfied/dissatisfied are you with your current sleep pattern?', choices: ['Very satisfied', 'Satisfied', 'Moderately satisfied', 'Dissatisfied', 'Very dissatisfied'], scores: [0, 1, 2, 3, 4] },
      { text: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?', choices: ['Not at all noticeable', 'A little', 'Somewhat', 'Much', 'Very much noticeable'], scores: [0, 1, 2, 3, 4] },
      { text: 'How worried/distressed are you about your current sleep problem?', choices: ['Not at all worried', 'A little', 'Somewhat', 'Much', 'Very much worried'], scores: [0, 1, 2, 3, 4] },
      { text: 'To what extent do you consider your sleep problem to interfere with your daily functioning?', choices: ['Not at all interfering', 'A little', 'Somewhat', 'Much', 'Very much interfering'], scores: [0, 1, 2, 3, 4] }
    ],
    scoringLogic: 'isi'
  };
  
  await AssessmentTestTemplate.deleteMany({ name: { $in: ['phq9', 'gad7', 'pss', 'who5', 'isi'] } });
  await AssessmentTestTemplate.create([phq9, gad7, pss, who5, isi]);
  console.log('Seeded PHQ-9, GAD-7, PSS, WHO-5, ISI templates.');
  
}

module.exports = seedAssessments;