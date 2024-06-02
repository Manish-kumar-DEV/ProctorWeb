"use client";
import { Assessment } from "@/utils/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

const Assessments = () => {
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

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
          </tr>
        </thead>
        <tbody>
          {assessments?.map((assessment) => (
            <tr key={assessment.id}>
              <td className="py-2 px-4 border-b">{assessment.title}</td>
              <td className="py-2 px-4 border-b">{assessment.description}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  href={`/dashboard/assessments/${assessment.id}`}
                  className="bg-blue-500 text-white py-1 px-2 rounded"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assessments;
