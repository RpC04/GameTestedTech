"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

const menuData = [
    {
        label: "PC Hardware & Components",
        subcategories: [
            { label: "CPUs (Central Processing Units)", href: "#" },
            { label: "GPUs (Graphics Processing Units)", href: "#" },
            { label: "Motherboards", href: "#" },
            { label: "RAM (Memory)", href: "#" },
            { label: "Storage (SSDs, HDDs)", href: "#" },
            { label: "Power Supplies (PSUs)", href: "#" },
            { label: "Cooling (CPU, GPU, Case)", href: "#" },
            { label: "PC Cases", href: "#" },
            { label: "Other Components", href: "#" },
            { label: "PC Builds & Guides", href: "#" },
        ],
    },
    {
        label: "PC & Gaming Peripherals",
        subcategories: [
            { label: "Mice", href: "#" },
            { label: "Keyboards", href: "#" },
            { label: "Headsets", href: "#" },
            { label: "Controllers", href: "#" },
            { label: "Webcams & Microphones", href: "#" },
            { label: "Streaming Hardware", href: "#" },
        ],
    },
];

export default function ArticlesDropdown() {
    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
                setOpen(false);
                setHoveredIndex(null);
            }}
        >
            <button
                className="flex items-center gap-1 px-4 py-2 text-white hover:text-game-cyan transition"
                aria-haspopup="true"
                aria-expanded={open}
                tabIndex={0}
            >
                <Link href="/articles" className="text-game-white hover:text-game-cyan transition">
                    Articles
                </Link>

                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div
                    className={`absolute left-0 top-full flex bg-[#0f0f23] shadow-2xl rounded-xl z-50 ${hoveredIndex === null ? "w-[256px]" : ""
                        }`}
                    style={{ minHeight: 0 }}
                >
                    {/*categories */}
                    <ul className="w-64 py-4 px-2 space-y-1 border-r border-[#0f0f23]">
                        {menuData.map((cat, i) => (
                            <li
                                key={cat.label}
                                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer gap-2 transition
                                  ${hoveredIndex === i ? "bg-[#ff6b35] text-white" : "text-purple-200 hover:bg-[#ff6b35]"}
                                `}
                                onMouseEnter={() => setHoveredIndex(i)}
                                tabIndex={0}
                            >
                                <span>{cat.label}</span>
                                <ChevronRight className="ml-auto w-4 h-4" />
                            </li>
                        ))}
                    </ul>
                    {hoveredIndex !== null && (
                        <ul
                            className="w-72 py-4 px-4 space-y-2"
                            style={{ minHeight: "100%" }}
                            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {menuData[hoveredIndex].subcategories.map((sub) => (
                                <li key={sub.label}>
                                    <Link
                                        href={sub.href}
                                        className="block px-3 py-2 rounded-lg text-purple-100 hover:bg-[#ff6b35] hover:text-white transition"
                                    >
                                        {sub.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}