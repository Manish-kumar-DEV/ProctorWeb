"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@nextui-org/react";

const QuizPage = ({ params }: any) => {
  const assessmentId = params.id;
  const [questions, setQuestions] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const userId = user?.id;

  useEffect(() => {
    console.log("The assessment Id is", assessmentId);
    if (assessmentId) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`/api/assessments/${assessmentId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("XLRI data is", data);
            setQuestions(data.questions);
          } else {
            console.error("Failed to fetch questions");
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };

      fetchQuestions();
    }
  }, [assessmentId]);

  const handleAnswerSelect = async (questionId: string, answerId: string) => {
    console.log("The questionId is", questionId, answerId);
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));

    try {
      await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          questionId,
          assessmentId,
          selectedAnswerId: answerId,
        }),
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitAssessment = () => {
    toast.success("Quiz submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
    router.push("/dashboard");
  };

  if (!questions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto">
      <div>
        <div className=" font-semibold antialiased">
          Total questions: {questions.length}
        </div>
        <div className="flex items-center">
          <div className="text-4xl">
            Question: {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div className=" ml-auto">
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={Number(
                (Object.keys(selectedAnswers).length / questions.length) * 100
              )}
              color="success"
              showValueLabel={true}
            />
          </div>
        </div>

        <div className="text-center">
          <div className="mt-4 border min-h-60 items-center justify-center flex text-4xl rounded-lg">
            {currentQuestion?.question.text}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {JSON.parse(currentQuestion?.question.answers || "[]").map(
              (answer: any) => (
                <button
                  key={answer.id}
                  className={`border rounded-md text-lg p-4 ${
                    selectedAnswers[currentQuestion?.question.id] === answer.id
                      ? "bg-blue-200 text-black border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswerSelect(currentQuestion?.question.id, answer.id)
                  }
                >
                  {answer.text}
                </button>
              )
            )}
          </div>
          <div className="flex justify-between mt-4">
            {currentQuestionIndex > 0 && (
              <button
                className="border p-2 px-4 text-lg rounded-md"
                onClick={handlePrevQuestion}
              >
                Prev
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="border p-2 px-4 text-lg ml-auto rounded-md"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            ) : (
              <button
                className="border p-2 px-4 text-lg ml-auto rounded-md"
                onClick={handleSubmitAssessment}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
