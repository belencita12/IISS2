import React from "react";

interface TagsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  availableTags,
  selectedTags,
  onChange,
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-2 py-1 border rounded ${
            selectedTags.includes(tag)
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};