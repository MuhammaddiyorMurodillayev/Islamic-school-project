// ... importlar o'sha-o'sha

import { Button, message } from "antd";
// import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../subabaseClient";



export default function ChangeWorkHours() {
    type Lang = "uz" | "ru" | "en";

    type WorkHourEntry = {
        id?: string;
        hour: Record<Lang, string>;
        day: Record<Lang, string>;
    };

    const [workHours, setWorkHours] = useState<WorkHourEntry[]>([]);

    // Load from Supabase
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("workHour").select();

            if (error) {
                console.error("Error fetching:", error);
                message.error("Ma'lumotlarni yuklashda xatolik");
                return;
            }

            if (data) {
                const formatted = data.map((item) => ({
                    id: item.id,
                    hour: item.hour,
                    day: item.day,
                }));
                setWorkHours(formatted);
            }
        };

        fetchData();
    }, []);

    // Input change
    const handleChange = (
        index: number,
        lang: Lang,
        value: string,
        field: "hour" | "day"
    ) => {
        const updated = [...workHours];
        updated[index][field][lang] = value;
        setWorkHours(updated);
    };

    // Add
    // const handleAdd = () => {
    //     setWorkHours([
    //         ...workHours,
    //         {
    //             hour: { uz: "", ru: "", en: "" },
    //             day: { uz: "", ru: "", en: "" },
    //         },
    //     ]);
    // };

    // Delete
    // const handleDelete = async (index: number) => {
    //     const toDelete = workHours[index];
    //     if (toDelete.id) {
    //         const { error } = await supabase
    //             .from("work_hours")
    //             .delete()
    //             .eq("id", toDelete.id);
    //         if (error) {
    //             message.error("O‘chirishda xatolik");
    //             return;
    //         }
    //     }

    //     setWorkHours(workHours.filter((_, i) => i !== index));
    // };

    // Save
    const handleSave = async () => {
        try {
            for (const entry of workHours) {
                if (entry.id) {
                    const { error } = await supabase
                        .from("workHour")
                        .update({ hour: entry.hour, day: entry.day })
                        .eq("id", entry.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from("workHour")
                        .insert({ hour: entry.hour, day: entry.day });
                    if (error) throw error;
                }
            }

            message.success("Muvaffaqiyatli saqlandi!");
        } catch (error) {
            console.error("Save error:", error);
            message.error("Saqlashda xatolik yuz berdi");
        }
    };

    return (
        <div className="max-w-2xl gap-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Change Work Hours and Day
            </h2>

            <div className="flex flex-col p-6 rounded-xl border border-gray-300 bg-emerald-50">
                <div className="flex flex-row gap-5">
                    {/* HOURS */}
                    <div className="flex flex-col w-1/2">
                        {workHours.map((entry, index) => (
                            <div
                                key={`hour-${index}`}
                                className="flex flex-col gap-2 border text-start p-3 rounded bg-white shadow-sm"
                            >
                                {(["en", "ru", "uz"] as Lang[]).map((lang) => (
                                    <div
                                        key={lang}
                                        className="flex gap-3 justify-center items-center"
                                    >
                                        <label className="text-sm">
                                            {lang.toUpperCase()}:
                                        </label>
                                        <input
                                            value={entry.hour[lang]}
                                            onChange={(e) =>
                                                handleChange(index, lang, e.target.value, "hour")
                                            }
                                            placeholder={`Working hour (${lang})`}
                                            className="px-3 py-2 border rounded w-full outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                ))}
                                {/* <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-600 hover:text-red-800 mt-2 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-5 h-5" /> Delete
                                    </button>
                                </div> */}
                            </div>
                        ))}
                        {/* <Button type="dashed" onClick={handleAdd} className="mt-4 w-fit px-5">
                            <Plus className="w-4 h-4" />
                            Add Work Hour
                        </Button> */}
                    </div>

                    {/* DAYS */}
                    <div className="flex flex-col w-1/2">
                        {workHours.map((entry, index) => (
                            <div
                                key={`day-${index}`}
                                className="flex flex-col gap-2 border text-start p-3 rounded bg-white shadow-sm"
                            >
                                {(["en", "ru", "uz"] as Lang[]).map((lang) => (
                                    <div
                                        key={lang}
                                        className="flex gap-3 justify-center items-center"
                                    >
                                        <label className="text-sm">
                                            {lang.toUpperCase()}:
                                        </label>
                                        <input
                                            value={entry.day[lang]}
                                            onChange={(e) =>
                                                handleChange(index, lang, e.target.value, "day")
                                            }
                                            placeholder={`Working day (${lang})`}
                                            className="px-3 py-2 border rounded w-full outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                ))}
                                {/* <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-600 hover:text-red-800 mt-2 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-5 h-5" /> Delete
                                    </button>
                                </div> */}
                            </div>
                        ))}
                        {/* <Button type="dashed" onClick={handleAdd} className="mt-4 w-fit px-5">
                            <Plus className="w-4 h-4" />
                            Add Work Day
                        </Button> */}
                    </div>
                </div>

                <div className="m-2">
                    <hr className="bg-gray-300 shadow h-0.5" />
                </div>

                <div className="w-full items-center text-center">
                    <Button
                        type="primary"
                        onClick={handleSave}
                        className="border border-gray-400 w-fit rounded px-10 py-1 bg-green-700 text-white hover:bg-green-200 hover:text-black"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
