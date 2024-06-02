"use client";
import { Assessment } from "@/utils/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Assessments = () => {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  const handleAttemptQuiz = (id: string) => {
    router.push(`/dashboard/quiz/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/assessments/${id}`);
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      const response = await fetch("/api/assessments");
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      } else {
        console.error("Failed to fetch assessments");
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="mx-auto max-w-270 ">
      <h1 className="text-2xl font-bold mb-4">Assessments</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
            <th className="py-2 px-4 border-b">Attempt</th>
          </tr>
        </thead>
        <tbody>
          {assessments?.map((assessment) => (
            <tr key={assessment.id}>
              <td className="py-2 px-4 border-b">{assessment.title}</td>
              <td className="py-2 px-4 border-b">{assessment.description}</td>
              <td className="py-2  border-b">
                <button
                  className="bg-blue-500 h-full text-white px-4 py-2 rounded"
                  onClick={() => handleViewDetails(assessment.id)}
                >
                  View Details
                </button>
              </td>
              <td className="py-2  border-b">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAttemptQuiz(assessment.id)}
                >
                  Attempt Quiz
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assessments;
