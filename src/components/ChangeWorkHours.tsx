import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../subabaseClient";
import { Button, message } from "antd";

type Lang = "uz" | "ru" | "en";

type WorkHourEntry = {
  id?: string;
  hour: Record<Lang, string>;
};

export default function ChangeWorkHoursUI() {
  const [workHours, setWorkHours] = useState<WorkHourEntry[]>([]);

  // Load from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("work_hours").select("*");

      if (error) {
        console.error("Error fetching:", error);
        message.error("Ma'lumotlarni yuklashda xatolik");
        return;
      }

      if (data) {
        const formatted = data.map((item) => ({
          id: item.id,
          hour: item.hour,
        }));
        setWorkHours(formatted);
      }
    };

    fetchData();
  }, []);

  // Input change
  const handleChange = (index: number, lang: Lang, value: string) => {
    const updated = [...workHours];
    updated[index].hour[lang] = value;
    setWorkHours(updated);
  };

  // Add
  const handleAdd = () => {
    setWorkHours([
      ...workHours,
      {
        hour: {
          uz: "",
          ru: "",
          en: "",
        },
      },
    ]);
  };

  // Delete
  const handleDelete = async (index: number) => {
    const toDelete = workHours[index];
    if (toDelete.id) {
      const { error } = await supabase.from("work_hours").delete().eq("id", toDelete.id);
      if (error) {
        message.error("O‘chirishda xatolik");
        return;
      }
    }

    setWorkHours(workHours.filter((_, i) => i !== index));
  };

  // Save
  const handleSave = async () => {
    for (const entry of workHours) {
      if (entry.id) {
        // Update
        await supabase
          .from("work_hours")
          .update({ hour: entry.hour })
          .eq("id", entry.id);
      } else {
        // Insert
        await supabase
          .from("work_hours")
          .insert({ hour: entry.hour });
      }
    }

    message.success("Muvaffaqiyatli saqlandi!");
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg max-w-xl mx-auto mt-8">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
        Work Hours
      </h2>

      <div className="flex flex-col gap-4">
        {workHours.map((entry, index) => (
          <div key={index} className="flex flex-col gap-2 border p-3 rounded bg-white shadow-sm">
            {(["en", "ru", "uz"] as Lang[]).map((lang) => (
              <input
                key={lang}
                value={entry.hour[lang]}
                onChange={(e) => handleChange(index, lang, e.target.value)}
                placeholder={`Working hour (${lang})`}
                className="px-3 py-2 border rounded w-full outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ))}

            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-800 mt-2 flex items-center gap-1"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 border border-dashed border-gray-400 rounded-md px-3 py-2 mt-2 text-gray-600 hover:bg-gray-100 transition"
        >
          <Plus className="w-4 h-4" />
          Add Work Hour
        </button>

        <Button type="primary" onClick={handleSave} className="mt-4">
          Save
        </Button>
      </div>
    </div>
  );
}
