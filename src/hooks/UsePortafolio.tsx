import { designs } from "@/components/portafolio/data";
import { useState } from "react";

function UsePortafolio() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDesc, setExpandedDesc] = useState<number[]>([]);

    const filteredDesigns = designs.filter(design => {
        const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const toggleDescription = (id: number) => {
        setExpandedDesc(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return {
        searchQuery,
        expandedDesc,
        filteredDesigns,
        setSearchQuery,
        toggleDescription,
        truncateText,
    }
}

export default UsePortafolio