"use client";
import { useEffect, useState } from "react";
import { Assessment } from "@/utils/constants";

const AssessmentDetailsPage = ({ params }: any) => {
  const { id } = params;
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    if (id) {
      const fetchAssessment = async () => {
        const response = await fetch(`/api/assessments/${id}`);

        if (response.ok) {
          const data = await response.json();
          setAssessment(data);
        } else {
          console.error("Failed to fetch assessment details");
        }
      };

      fetchAssessment();
    }
  }, [id]);

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
      <p className="mb-4">{assessment.description}</p>
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      <ul>
        {assessment.questions.map((assessmentQuestion) => (
          <li key={assessmentQuestion.question.id} className="mb-2">
            {assessmentQuestion.question.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssessmentDetailsPage;
