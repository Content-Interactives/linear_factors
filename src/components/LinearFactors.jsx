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
  };

  const [currentProblem, setCurrentProblem] = useState({
    a: 2,
    b: 3,
    expression: '2x + 3',
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
        break;
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
  };

  React.useEffect(() => {
    generateProblem();
  }, []);

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Linear Factors</h1>
          <p className="text-sky-800">Learn about linear factors and find their zeros!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is a Linear Factor?</h2>
            <p className="text-blue-600">
              Linear factors are polynomials of degree 1, meaning the highest exponent of the variable is 1. 
              They are expressed in the form <span className="font-mono">ax + b</span>, where a and b are real numbers, 
              and a≠0. Higher degree polynomials can often be factored into linear factors to find their roots or zeros.
              Practice identifying linear factors and their zeros below!
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-lg mt-8 mb-6">Given: 3x + 12</p>
                  <div>
                    <p className="font-medium">Step 1: Identify if this is a linear factor</p>
                    <div className="p-4 my-2">
                      <ul className="list-disc ml-6">
                        <li>The highest exponent of x is 1</li>
                        <li>The expression is in the form ax + b where a = 3 and b = 12</li>
                        <li>Since a ≠ 0, this is a linear factor</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Step 2: Set the expression equal to zero</p>
                    <div className="p-4 my-2">3x + 12 = 0</div>
                  </div>
                  <div>
                    <p className="font-medium">Step 3: Solve for x</p>
                    <div className="p-4 my-2">
                      3x + 12 = 0<br/>
                      3x = -12<br/>
                      x = -4
                    </div>
                  </div>
                  <p className="font-bold text-green-600 mt-4">
                    Therefore, -4 is the zero of the linear factor 3x + 12
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-2xl mb-4">
              <span className="font-mono">{currentProblem.expression}</span>
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="mb-4">1. Is this a linear factor?</p>
                {completedSteps.step1 ? (
                  <>
                    <p className="text-green-600 font-bold mb-6">
                      {currentProblem.isLinear 
                        ? "Yes! This is a linear factor because the highest power of x is 1 and its coefficient is not 0."
                        : currentProblem.explanation}
                    </p>
                    {!currentProblem.isLinear && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                        <p className="text-green-700">
                          You've successfully identified a non-linear factor!
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-4">
                      <Button
                        onClick={() => checkAnswer(1, true)}
                        className={`bg-blue-400 hover:bg-blue-500 w-32 ${hasError.step1 && !currentProblem.isLinear ? 'border-2 border-red-500' : ''}`}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => checkAnswer(1, false)}
                        className={`bg-blue-400 hover:bg-blue-500 w-32 ${hasError.step1 && currentProblem.isLinear ? 'border-2 border-red-500' : ''}`}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep >= 2 && currentProblem.isLinear && (
                  <>
                    <p className="mb-4">2. Write the equation to solve for the zero:</p>
                    {completedSteps.step2 ? (
                      <p className="text-green-600 font-bold mb-6">
                        {currentProblem.expression} = 0
                      </p>
                    ) : (
                      <div className="flex items-center gap-4 mb-6">
                        <Input 
                          type="text"
                          value={userAnswers.step2}
                          onChange={(e) => {
                            setUserAnswers(prev => ({ ...prev, step2: e.target.value }));
                            setHasError(prev => ({ ...prev, step2: false }));
                          }}
                          placeholder="e.g., 2x + 3 = 0"
                          className={`flex-1 ${hasError.step2 ? 'border-red-500' : 'border-blue-300'}`}
                        />
                        <div className="flex gap-4">
                          <Button
                            onClick={() => checkAnswer(2, userAnswers.step2)}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(2)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStep >= 3 && (
                  <>
                    <p className="mb-4">3. Solve for x to find the zero:</p>
                    {completedSteps.step3 ? (
                      <>
                        <p className="text-green-600 font-bold mb-6">
                          x = {currentProblem.solution}
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                          <p className="text-green-700">
                            You've successfully identified a linear factor and its zero!
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 mb-6">
                        <Input 
                          type="number"
                          step="0.01"
                          value={userAnswers.step3}
                          onChange={(e) => {
                            setUserAnswers(prev => ({ ...prev, step3: e.target.value }));
                            setHasError(prev => ({ ...prev, step3: false }));
                          }}
                          placeholder="e.g., -1.5"
                          className={`flex-1 ${hasError.step3 ? 'border-red-500' : 'border-blue-300'}`}
                        />
                        <div className="flex gap-4">
                          <Button
                            onClick={() => checkAnswer(3, userAnswers.step3)}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(3)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding linear factors is essential for solving polynomial equations!
      </p>
    </div>
  );
};

export default LinearFactors;