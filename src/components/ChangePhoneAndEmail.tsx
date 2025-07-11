import { useEffect, useState } from "react";
import { supabase } from "../subabaseClient";
import { Button, message } from "antd";
import { Plus, Trash2 } from "lucide-react";

type ContactItem = { value: string };

function ChangePhoneAndEmail() {
    type FormData = {
        phone: string[];
        email: string[];
    };

    const [formData, setFormData] = useState<FormData>({
        phone: [],
        email: [],
    });

    const [contactId, setContactId] = useState<number | null>(null); // for update

    useEffect(() => {
        const loadAllData = async () => {
            const { data, error } = await supabase
                .from("contacts")
                .select(`id, phones, emails`);

            if (error || !data || data.length === 0) {
                console.log("Topilmadi yoki bo‘sh");
                return;
            }

            const contact = data[0];

            setContactId(contact.id); // Save ID for update

            const phones: string[] =
                contact.phones?.map((e: ContactItem) => e.value) || [];

            const emails: string[] =
                contact.emails?.map((e: ContactItem) => e.value) || [];

            setFormData({
                phone: phones,
                email: emails,
            });
        };

        loadAllData();
    }, []);

    const handleChange = (
        type: "phone" | "email",
        index: number,
        value: string
    ) => {
        setFormData((prev) => {
            const updated = [...prev[type]];
            updated[index] = value;
            return {
                ...prev,
                [type]: updated,
            };
        });
    };

    const handleDelete = (type: "phone" | "email", index: number) => {
        setFormData((prev) => {
            const updated = [...prev[type]];
            updated.splice(index, 1);
            return {
                ...prev,
                [type]: updated,
            };
        });
    };

    const addNewPhoneInput = () => {
        setFormData((prev) => ({
            ...prev,
            phone: [...prev.phone, ""],
        }));
    };

    const addNewEmailInput = () => {
        setFormData((prev) => ({
            ...prev,
            email: [...prev.email, ""],
        }));
    };

    const handleSave = async () => {
        if (!contactId) {
            message.error("Contact ID topilmadi");
            return;
        }

        // Prepare array of objects for JSONB
        const phones = formData.phone.map((value) => ({ value }));
        const emails = formData.email.map((value) => ({ value }));

        const { error } = await supabase
            .from("contacts")
            .update({ phones, emails })
            .eq("id", contactId);

        if (error) {
            message.error("Saqlashda xatolik yuz berdi");
            console.error(error);
        } else {
            message.success("Muvaffaqiyatli saqlandi");
        }
    };

    return (
        <div className=" max-w-xl ">
            <h1 className="text-3xl font-semibold">Change Contacts</h1>

            <div className="border border-gray-300 text-start rounded-2xl py-3 px-7 mt-5 bg-emerald-50 w-full max-w-lg">
                <div>
                    <label className="block ml-1 text-md font-medium text-gray-700 mb-1">
                        Phone:
                    </label>
                    {formData.phone.map((phone, index) => (
                        <div className="flex gap-2" key={`phone-${index}`}>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => handleChange("phone", index, e.target.value)}
                                className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                            />
                            <Trash2
                                className="my-2 cursor-pointer text-red-800 hover:text-red-950"
                                onClick={() => handleDelete("phone", index)}
                            />
                        </div>
                    ))}
                    <Button
                        type="dashed"
                        onClick={addNewPhoneInput}
                        icon={<Plus className="w-4 h-4" />}
                        className="mt-2 w-fit px-5"
                    >
                        Add Phone
                    </Button>
                </div>

                <div className="m-2">
                    <hr className="bg-gray-300 shadow h-0.5" />
                </div>

                <div>
                    <label className="block ml-1 text-md font-medium text-gray-700 mb-1">
                        Email:
                    </label>
                    {formData.email.map((email, index) => (
                        <div className="flex gap-2" key={`email-${index}`}>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => handleChange("email", index, e.target.value)}
                                className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                            />
                            <Trash2
                                className="my-2 cursor-pointer text-red-800 hover:text-red-950"
                                onClick={() => handleDelete("email", index)}
                            />
                        </div>
                    ))}
                    <Button
                        type="dashed"
                        onClick={addNewEmailInput}
                        icon={<Plus className="w-4 h-4" />}
                        className="mt-2 w-fit px-5"
                    >
                        Add Email
                    </Button>
                </div>

                <div className="m-2">
                    <hr className="bg-gray-300 shadow h-0.5" />
                </div>
                <div className="w-full items-center justify-center text-center">
                    <button
                        onClick={handleSave}
                        className="border border-gray-400 w-fit rounded px-10 py-1 bg-green-700 text-white hover:bg-green-200 hover:text-black"
                    >
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ChangePhoneAndEmail;
