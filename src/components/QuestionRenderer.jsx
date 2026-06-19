import React, { useState, useCallback } from 'react';

function GroupingVisual({ question }) {
  const t = question.themeData;
  const groups = Array.from({ length: question.quotient }, (_, i) =>
    Array.from({ length: question.divisor }, (_, j) => `${i}-${j}`)
  );
  return (
    <div className="practice-grouping-visual">
      {groups.map((group, gi) => (
        <div key={gi} className="practice-group-box">
          <div className="practice-group-label">
            {t.containerEmoji} {t.container} {gi + 1}
          </div>
          <div className="practice-group-items">
            {group.map((k) => (
              <span key={k}>{t.emoji}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InverseVisual({ question }) {
  return (
    <div className="inverse-visual">
      <div className="inverse-row">
        {question.divisor} × {question.quotient} = {question.dividend}
      </div>
      <div className="inverse-arrow">↓</div>
      <div className="inverse-row highlight">
        {question.dividend} ÷ {question.divisor} = ?
      </div>
    </div>
  );
}

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback(
    (option) => {
      if (disabled) return;
      setSelectedOption(option);
      const isCorrect = String(option) === String(question.correctAnswer);
      setTimeout(() => {
        onAnswer(isCorrect);
        setSelectedOption(null);
      }, 600);
    },
    [disabled, question.correctAnswer, onAnswer]
  );

  return (
    <div>
      <div className="question-type-badge">➗ DIVISION GROUPING</div>
      <p className="question-text">{question.questionText}</p>

      {question.visual === 'grouping' && <GroupingVisual question={question} />}
      {question.visual === 'inverse' && <InverseVisual question={question} />}
      {question.visual === 'sentence' && (
        <div className="sentence-visual">
          {question.dividend} ÷ {question.divisor} = ?
        </div>
      )}

      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
