import { useEffect, useState, useCallback } from 'react';
import { apiCache } from '@/lib/cache';

export interface CourseFromAPI {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  isLocked?: boolean;
  sections: {
    name: string;
    sessions: {
      id: number;
      title: string;
      duration: string;
      audioUrl: string;
      thumbnail?: string;
    }[];
  }[];
}

export function useCourses() {
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      // Try cache first
      const cached = apiCache.get<{ courses: CourseFromAPI[] }>('courses');
      if (cached) {
        setCourses(cached.courses);
        setLoading(false);
        return;
      }

      // Fetch from API
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();

      if (data.courses) {
        setCourses(data.courses);
        apiCache.set('courses', data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}
