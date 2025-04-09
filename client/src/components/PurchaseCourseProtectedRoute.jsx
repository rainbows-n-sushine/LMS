import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading, isError, error } = useGetCourseDetailWithStatusQuery(courseId);

  // Loading state
  if (isLoading) {
    return <p>Loading course details...</p>;
  }

  // Error state
  if (isError) {
    console.error("Error fetching course details:", error);
    return <p>There was an error loading the course details. Please try again later.</p>;
  }

  // Redirect if the course is not purchased
  if (!data?.purchased) {
    return <Navigate to={`/course-detail/${courseId}`} />;
  }

  // Return children (protected route content)
  return children;
};

export default PurchaseCourseProtectedRoute;
