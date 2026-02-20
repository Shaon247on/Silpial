
import { LegalReference } from "@/types/law.type";
import { Edit, Trash2 } from "lucide-react";

interface ReferenceListProps {
  references: LegalReference[];
  selectedId: string | null;
  onSelect: (ref: LegalReference) => void;
  onEdit: (ref: LegalReference) => void;
  onDelete: (ref: LegalReference) => void;
}

export default function ReferenceList({
  references,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: ReferenceListProps) {
  return (
    <div className="space-y-4">
      {references.map((ref) => (
        <div
          key={ref.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedId === ref.id ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
          onClick={() => onSelect(ref)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{ref.title}</h3>
              <p className="text-sm text-gray-500">{ref.category}</p>
              <p className="text-xs text-gray-400">Última actualización: {ref.updatedAt}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ref);
                }}
                className="text-gray-500 hover:text-blue-500"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ref);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}