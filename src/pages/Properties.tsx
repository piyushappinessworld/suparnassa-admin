import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchProperties,
  deleteProperty,
} from "@/store/properties/propertySlice";
import { toast } from "sonner";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal

// Define property type for better type safety
export interface Property {
  id: any;
  name: string;
  location: string;
  type: string;
  details: string;
  images: string[];
  _id?: string; // Added for MongoDB
}

const Properties = () => {
  const [search, setSearch] = useState("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{
    [key: string]: number;
  }>({});
  const [filterType, setFilterType] = useState<string>("all"); // State for type filter
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal visibility
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null); // State for property to delete
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get properties from Redux store
  const { properties, isLoading } = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleDeleteClick = (id: string) => {
    setPropertyToDelete(id); // Set the property to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await dispatch(deleteProperty(propertyToDelete)).unwrap();
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setIsDeleteModalOpen(false); // Close the modal
      setPropertyToDelete(null); // Reset the property to delete
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the modal
    setPropertyToDelete(null); // Reset the property to delete
  };

  const handleEdit = (id: any) => {
    console.log(id);
    navigate(`/edit-property/${id}`);
  };

  const handlePrevImage = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    const property = properties.find((p) => p._id === propertyId);
    if (!property) return;

    setCurrentImageIndexes((prev) => ({
      ...prev,
      [propertyId]:
        ((prev[propertyId] || 0) - 1 + property.images.length) %
        property.images.length,
    }));
  };

  const handleNextImage = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    const property = properties.find((p) => p._id === propertyId);
    if (!property) return;

    setCurrentImageIndexes((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % property.images.length,
    }));
  };

  // Filter properties based on search and type
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "all" || property.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  // Get unique property types for the filter dropdown
  const propertyTypes = [
    ...new Set(properties.map((property) => property.type)),
  ];

  return (
    <div className="animate-fadeIn">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="all">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property._id || property.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary/20 transition-all"
          >
            <div className="relative aspect-w-16 aspect-h-9 bg-black/60">
              <img
                src={property.images[currentImageIndexes[property._id] || 0]}
                alt={property.name}
                className="object-contain w-full h-[350px]"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => handlePrevImage(e, property._id)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => handleNextImage(e, property._id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                <button
                  onClick={() => handleEdit(property._id)}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteClick(property._id)}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {property.name}
              </h3>
              <div className="flex items-center mt-2 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {property.type}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{property.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
