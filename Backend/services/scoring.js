// Modular scoring logic for mental health assessments

function scorePHQ9(responses) {
  const total = responses.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let feedback = '';
  if (total <= 4) {
    interpretation = 'Minimal depression';
    feedback = "Your score suggests minimal depressive symptoms. Keep maintaining healthy habits!";
  } else if (total <= 9) {
    interpretation = 'Mild depression';
    feedback = "Mild symptoms detected. Consider self-care and monitor your mood. If symptoms persist, consult a professional.";
  } else if (total <= 14) {
    interpretation = 'Moderate depression';
    feedback = "You're showing signs of moderate depression. Scheduling time for self-care and reaching out to a mental health professional is recommended.";
  } else if (total <= 19) {
    interpretation = 'Moderately severe depression';
    feedback = "Symptoms indicate moderately severe depression. Please consider speaking to a counselor or mental health professional soon.";
  } else {
    interpretation = 'Severe depression';
    feedback = "Your score suggests severe depression. It's important to seek help from a mental health professional as soon as possible.";
  }
  return { totalScore: total, interpretation, feedback };
}

function scoreGAD7(responses) {
  const total = responses.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let feedback = '';
  if (total <= 4) {
    interpretation = 'Minimal anxiety';
    feedback = "Your score suggests minimal anxiety. Keep up your healthy coping strategies!";
  } else if (total <= 9) {
    interpretation = 'Mild anxiety';
    feedback = "Mild anxiety detected. Practice relaxation techniques and monitor your feelings. If symptoms persist, consider professional support.";
  } else if (total <= 14) {
    interpretation = 'Moderate anxiety';
    feedback = "You're experiencing moderate anxiety. Self-care and talking to a counselor may be helpful.";
  } else {
    interpretation = 'Severe anxiety';
    feedback = "Your score suggests severe anxiety. Please reach out to a mental health professional for support.";
  }
  return { totalScore: total, interpretation, feedback };
}

function scorePSS(responses) {
  const total = responses.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let feedback = '';
  if (total <= 13) {
    interpretation = 'Low stress';
    feedback = "Your stress level is low. Keep up your healthy coping strategies!";
  } else if (total <= 26) {
    interpretation = 'Moderate stress';
    feedback = "You are experiencing moderate stress. Consider relaxation techniques and self-care.";
  } else {
    interpretation = 'High stress';
    feedback = "Your stress level is high. Please consider stress management strategies or consult a professional.";
  }
  return { totalScore: total, interpretation, feedback };
}

function scoreWHO5(responses) {
  const total = responses.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let feedback = '';
  if (total <= 12) {
    interpretation = 'Poor well-being';
    feedback = "Your well-being score is low. Consider self-care and reaching out for support.";
  } else if (total <= 16) {
    interpretation = 'OK well-being';
    feedback = "Your well-being is okay. Keep monitoring and practicing positive habits.";
  } else {
    interpretation = 'Good well-being';
    feedback = "You have good well-being. Keep up the positive lifestyle!";
  }
  return { totalScore: total, interpretation, feedback };
}

function scoreISI(responses) {
  const total = responses.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let feedback = '';
  if (total <= 7) {
    interpretation = 'No clinically significant insomnia';
    feedback = "Your sleep pattern is healthy. Maintain your good sleep habits!";
  } else if (total <= 14) {
    interpretation = 'Subthreshold insomnia';
    feedback = "You have mild sleep difficulties. Consider improving your sleep hygiene.";
  } else if (total <= 21) {
    interpretation = 'Moderate insomnia';
    feedback = "You are experiencing moderate insomnia. Try sleep routines and consult a professional if needed.";
  } else {
    interpretation = 'Severe insomnia';
    feedback = "You have severe insomnia. Please consult a sleep specialist or healthcare provider.";
  }
  return { totalScore: total, interpretation, feedback };
}

module.exports = {
  phq9: scorePHQ9,
  gad7: scoreGAD7,
  pss: scorePSS,
  who5: scoreWHO5,
  isi: scoreISI
}; 