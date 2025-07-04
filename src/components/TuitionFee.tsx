import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { supabase } from "../subabaseClient";
import { useLanguage } from "../contexts/LanguageContext";

interface TuitionFee {
    setTrigger: Dispatch<SetStateAction<number>>;
    trigger: number;
    titleTable: string;
    tableName: string;
}

const TuitionFee = ({ setTrigger, trigger, titleTable, tableName }: TuitionFee) => {
    const { language } = useLanguage();

    type Row = {
        id: string,
        fee_type: RowType;
        amount: RowType;
        due: RowType;
    };

    type EditCell = {
        row: number;
        key: keyof Row | "";
    };

    type RowType = {
        en: string;
        ru: string;
        uz: string;
    };

    const [rows, setRows] = useState<Row[]>([]);
    const [editCell, setEditCell] = useState<EditCell>({ row: -1, key: "" });

    useEffect(() => {
        async function getTuitionFromDB() {
            const { data, error } = await supabase
                .from(tableName)
                .select(`
          id,
          fee_type,
          amount ,
          due ,
          created_at
        `);

            if (error || !data) {
                console.error("❌ Error fetching data:", error?.message);
                return;
            }

            setRows(
                data
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((row: any) => ({
                        id: row.id,
                        amount: Array.isArray(row.amount) ? row.amount[0] : row.amount,
                        fee_type: Array.isArray(row.fee_type) ? row.fee_type[0] : row.fee_type,
                        due: Array.isArray(row.due) ? row.due[0] : row.due,
                    }))
            );
        }

        getTuitionFromDB();
    }, []);

    const handleCellChange = (
        lang: "en" | "ru" | "uz",
        value: string,
        rowIndex: number,
        key: keyof Row
    ) => {
        const updated = [...rows];
        (updated[rowIndex][key] as RowType)[lang] = value;
        setRows(updated);
    };

    const upload = async () => {
        const updates = rows.map((row) =>
            supabase
                .from(tableName)
                .update({
                    fee_type: row.fee_type,
                    amount: row.amount,
                    due: row.due,
                })
                .eq("id", row.id)
        );

        const results = await Promise.all(updates);

        results.forEach((res, i) => {
            if (res.error) {
                console.error(`❌ Row ${rows[i].id} update failed:`, res.error.message);
            } else {
                // console.log(`✅ Row ${rows[i].id} updated`);
            }
        });

        setTrigger(trigger + 1);
    };

    const getTranslation = (word?: RowType): string => {
        if (!word) return "";
        return word[language] || word.en || word.uz || word.ru || "";
    };

    return (
        <div className="flex flex-col  text-white">
            <section>
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-2xl font-semibold mb-4">{titleTable}</h3>

                    <table className="w-full text-left bg-white text-gray-800 rounded-lg overflow-hidden mb-10">
                        <thead className="bg-emerald-700 text-white">
                            <tr>
                                <th className="p-3">Fee Type</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Due</th>
                                <th className="py-3 text-center hover:scale-105 cursor-pointer" onClick={upload}>Save</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((_row, rowIndex) => (
                                <tr key={rowIndex+1} className="border-b">
                                    {(["fee_type", "amount", "due"] as (keyof Row)[]).map((key) => (
                                        <td
                                            key={key}
                                            className="p-3 cursor-pointer hover:bg-emerald-100"
                                            onClick={() => setEditCell({ row: rowIndex, key })}
                                        >
                                            {editCell.row === rowIndex && editCell.key === key ? (
                                                <div className="flex flex-col gap-1 items-center">
                                                    {(["en", "ru", "uz"] as const).map((lang) => (
                                                        <input
                                                            key={lang}
                                                            className="w-full px-2 py-1 border border-emerald-400 rounded text-sm"
                                                            placeholder={lang.toUpperCase()}
                                                            value={(rows[rowIndex][key] as RowType)[lang]}
                                                            onChange={(e) =>
                                                                handleCellChange(lang, e.target.value, rowIndex, key)
                                                            }
                                                        />
                                                    ))}
                                                    <button
                                                        className="px-1 text-sm text-emerald-700 bg-emerald-100 border rounded border-emerald-500 w-fit hover:bg-emerald-500 hover:text-emerald-900"
                                                        onClick={() => {
                                                            setEditCell({ row: -1, key: "" })
                                                        }
                                                        }
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            ) : (
                                                getTranslation(rows[rowIndex][key] as RowType)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default TuitionFee;
