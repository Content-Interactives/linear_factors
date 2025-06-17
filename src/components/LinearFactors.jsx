import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const LinearFactors = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSteps, setShowSteps] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [userAnswers, setUserAnswers] = useState({
    step1: '',
    step2: '',
    step3: ''
  });
  const [hasError, setHasError] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false,
    step3: false
  });

  const generateProblem = () => {
    const isLinear = Math.random() < 0.7;
    
    if (isLinear) {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 10) - 5;
      const solution = (-b / a).toFixed(2);
      
      setCurrentProblem({
        expression: `${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}`,
        isLinear: true,
        solution
      });
    } else {
      const isQuadratic = Math.random() < 0.5;
      
      if (isQuadratic) {
        const a = Math.floor(Math.random() * 3) + 1;
        setCurrentProblem({
          expression: `${a}x²`,
          isLinear: false,
          solution: null,
          explanation: "This is not a linear factor because it contains x²."
        });
      } else {
        const num = Math.floor(Math.random() * 10) + 1;
        setCurrentProblem({
          expression: `${num}`,
          isLinear: false,
          solution: null,
          explanation: "This is not a linear factor because it doesn't contain x."
        });
      }
    }
    
    setCurrentStep(1);
    setCompletedSteps({
      step1: false,
      step2: false,
      step3: false
    });
    setUserAnswers({
      step1: '',
      step2: '',
      step3: ''
    });
    setHasError({
      step1: false,
      step2: false,
      step3: false
    });
    setShowSteps(false);
    setCurrentStepIndex(0);
    setShowNavigationButtons(false);
    setNavigationDirection(null);
    setStepSkipped({
      step1: false,
      step2: false,
      step3: false
    });
  };

  const [currentProblem, setCurrentProblem] = useState({
    expression: '2x + 3',
    isLinear: true,
    solution: '-1.50'
  });

  const checkAnswer = (step, answer) => {
    let correct = false;
    switch (step) {
      case 1:
        correct = answer === currentProblem.isLinear;
        if (correct) {
          setCompletedSteps(prev => ({ ...prev, step1: true }));
          setCurrentStep(2);
        }
        setHasError(prev => ({ 
          ...prev, 
          step1: answer ? !currentProblem.isLinear : currentProblem.isLinear 
        }));
        return correct;
      case 2:
        const equation = answer.replace(/\s/g, '').toLowerCase();
        const expectedEq = `${currentProblem.expression}=0`.replace(/\s/g, '').toLowerCase();
        correct = equation === expectedEq;
        if (correct) {
          setCompletedSteps(prev => ({ ...prev, step2: true }));
          setCurrentStep(3);
        }
        break;
      case 3:
        const userSolution = parseFloat(answer);
        const expectedSolution = parseFloat(currentProblem.solution);
        correct = Math.abs(userSolution - expectedSolution) < 0.1;
        if (correct) {
          setCompletedSteps(prev => ({ ...prev, step3: true }));
        }
        break;
    }
    setHasError(prev => ({ ...prev, [`step${step}`]: !correct }));
    return correct;
  };

  const skipStep = (step) => {
    setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
    setCurrentStep(step + 1);
    setStepSkipped(prev => ({ ...prev, [`step${step}`]: true }));
  };

  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < 2) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  React.useEffect(() => {
    generateProblem();
  }, []);

  React.useEffect(() => {
    if (completedSteps.step1 && completedSteps.step2 && completedSteps.step3) {
      setShowNavigationButtons(true);
    }
  }, [completedSteps]);

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Linear Factors Practice</h2>
            <Button 
              onClick={generateProblem}
              className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[32px] flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Problem
            </Button>
          </div>

          <div className="text-center text-xl mb-4">
            <span className="font-mono">{currentProblem.expression}</span>
          </div>

          <div className={`glow-button ${showSteps ? 'simple-glow stopped' : 'simple-glow'}`}>
            <Button 
              onClick={() => {
                setShowSteps(true);
                setCompletedSteps({
                  step1: false,
                  step2: false,
                  step3: false
                });
                setUserAnswers({
                  step1: '',
                  step2: '',
                  step3: ''
                });
                setHasError({
                  step1: false,
                  step2: false,
                  step3: false
                });
                setCurrentStepIndex(0);
                setShowNavigationButtons(false);
                setNavigationDirection(null);
                setStepSkipped({
                  step1: false,
                  step2: false,
                  step3: false
                });
              }}
              className="w-full bg-[#008545] hover:bg-[#00703d] text-white py-2 rounded"
            >
              Solve Step by Step
            </Button>
          </div>
        </div>

        {showSteps && (
          <div className="bg-gray-50">
            <div className="p-4 space-y-4">
              <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                {currentStepIndex === 0 && (
                  <>
                    <p className="text-sm mb-2">Step 1: Is this a linear factor?</p>
                    {!completedSteps.step1 ? (
                      <div className="space-y-4">
                        <div className="flex gap-2 items-center">
                          <Button
                            onClick={() => checkAnswer(1, true)}
                            className={`${hasError.step1 && !currentProblem.isLinear ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => checkAnswer(1, false)}
                            className={`${hasError.step1 && currentProblem.isLinear ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                          >
                            No
                          </Button>
                          {hasError.step1 && (
                            <span className="text-yellow-500 font-medium ml-2">Try again!</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-[#008545] font-medium">
                          {currentProblem.isLinear 
                            ? "Yes! This is a linear factor because the highest power of x is 1 and its coefficient is not 0."
                            : currentProblem.explanation}
                        </p>
                      </div>
                    )}
                    {completedSteps.step1 && !showNavigationButtons && (
                      <div className="flex justify-end mt-4">
                        {!stepSkipped.step1 && (
                          <span className="text-green-600 font-medium mr-2 flex items-center">Great Job!</span>
                        )}
                        <div className="glow-button simple-glow">
                          <Button
                            onClick={() => setCurrentStepIndex(1)}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStepIndex === 1 && completedSteps.step1 && currentProblem.isLinear && (
                  <>
                    <p className="text-sm mb-2">Step 2: Write the equation to solve for the zero:</p>
                    {!completedSteps.step2 ? (
                      <div className="space-y-4">
                        <Input 
                          type="text"
                          value={userAnswers.step2}
                          onChange={(e) => {
                            setUserAnswers(prev => ({ ...prev, step2: e.target.value }));
                            setHasError(prev => ({ ...prev, step2: false }));
                          }}
                          placeholder="e.g., 2x + 3 = 0"
                          className={`flex-1 ${hasError.step2 ? 'border-yellow-500' : 'border-blue-300'}`}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => checkAnswer(2, userAnswers.step2)}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(2)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-[#008545] font-medium">
                          {currentProblem.expression} = 0
                        </p>
                      </div>
                    )}
                    {completedSteps.step2 && !showNavigationButtons && (
                      <div className="flex justify-end mt-4">
                        {!stepSkipped.step2 && (
                          <span className="text-green-600 font-medium mr-2 flex items-center">Great Job!</span>
                        )}
                        <div className="glow-button simple-glow">
                          <Button
                            onClick={() => setCurrentStepIndex(2)}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStepIndex === 2 && completedSteps.step2 && (
                  <>
                    <p className="text-sm mb-2">Step 3: Solve for x to find the zero:</p>
                    {!completedSteps.step3 ? (
                      <div className="space-y-4">
                        <Input 
                          type="number"
                          step="0.01"
                          value={userAnswers.step3}
                          onChange={(e) => {
                            setUserAnswers(prev => ({ ...prev, step3: e.target.value }));
                            setHasError(prev => ({ ...prev, step3: false }));
                          }}
                          placeholder="e.g., -1.5"
                          className={`flex-1 ${hasError.step3 ? 'border-yellow-500' : 'border-blue-300'}`}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => checkAnswer(3, userAnswers.step3)}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(3)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-[#008545] font-medium">
                          x = {currentProblem.solution}
                        </p>
                        {!stepSkipped.step3 && (
                          <span className="text-green-600 font-medium">Great Job!</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <div
                  className="nav-orbit-wrapper"
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                    opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                    pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div className="nav-button-orbit"></div>
                  <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                  <button
                    onClick={() => handleNavigateHistory('back')}
                    className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500 min-w-[100px] text-center">
                  Step {currentStepIndex + 1} of 3
                </span>
                <div
                  className="nav-orbit-wrapper"
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    visibility: showNavigationButtons && currentStepIndex < 2 ? 'visible' : 'hidden',
                    opacity: showNavigationButtons && currentStepIndex < 2 ? 1 : 0,
                    pointerEvents: showNavigationButtons && currentStepIndex < 2 ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div className="nav-button-orbit"></div>
                  <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                  <button
                    onClick={() => handleNavigateHistory('forward')}
                    className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LinearFactors;