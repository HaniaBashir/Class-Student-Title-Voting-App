import { useEffect, useState } from "react";
import { STUDENTS, TITLES } from "../data/constants";
import { supabase } from "../lib/supabase";
import type { Student, Title } from "../types";

export function useVotingData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [studentsResponse, titlesResponse] = await Promise.all([
        supabase.from("students").select("id, name").order("name"),
        supabase.from("titles").select("id, title_name, display_order").order("display_order"),
      ]);

      if (studentsResponse.error || titlesResponse.error) {
        setError("Live data could not be loaded, so local placeholder data is being used.");
        setStudents(
          STUDENTS.map((name, index) => ({
            id: `fallback-student-${index + 1}`,
            name,
          })),
        );
        setTitles(
          TITLES.map((title_name, index) => ({
            id: `fallback-title-${index + 1}`,
            title_name,
            display_order: index + 1,
          })),
        );
        setLoading(false);
        return;
      }

      setStudents(studentsResponse.data);
      setTitles(titlesResponse.data);
      setLoading(false);
    }

    void load();
  }, []);

  return { students, titles, loading, error };
}
