import { User } from '../../types/user';
import { notifyError, notifySuccess } from '../../utils/notification';
import { Category } from '../../types/category';
import { FaEdit, FaSave, FaTrash, } from 'react-icons/fa';
import CategoryService from '../../services/CategoryService';
import { UpdateCategoryData } from '../../validation/schemas';

interface CategoryManipulationProps {
    category: Category;
    user: User;
    isEditing: boolean;
    getData: () => UpdateCategoryData;
    hideCategory: () => void;
    updateCategory: (updatedContent: UpdateCategoryData) => void;
    setIsEditing: (isEditing: boolean) => void;
}

const CategoryManipulation: React.FC<CategoryManipulationProps> = ({ category, user, isEditing, getData, hideCategory, updateCategory, setIsEditing }) => {
    const handleSaveEdit = async () => {
        if (isEditing) {
            try {
                category.id === -1 ? await CategoryService.createCategory(getData()) : await CategoryService.deleteCategory(category.id);
                updateCategory(getData());
                setIsEditing(false);
                category.id !== -1 ? notifySuccess('Category added successfully')
                    : notifySuccess('Category updated successfully');
            } catch (error) {
                category.id === -1 ? notifyError(`Failed to create category. Category with this title already exists.`)
                    : notifyError(`Failed to update category.`);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                category.id !== -1 && await CategoryService.deleteCategory(category.id);
                notifySuccess('Category deleted successfully');
                hideCategory();
            } catch (error) {
                notifyError('Failed to delete category');
            }
        }
    }

    return (
        <div className="mt-4 flex items-center justify-between text-gray-600">
            {(user?.role === 'admin') &&
                <div className="flex items-center space-x-4">
                    <button onClick={handleSaveEdit} className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800">
                        {isEditing ? < FaSave size={22} /> : <FaEdit size={22} />}
                    </button>
                    <button onClick={handleDelete} className="flex items-center space-x-1 text-gray-600 hover:text-red-800">
                        <FaTrash size={22} />
                    </button>
                </div>
            }
        </div>
    );
};

export default CategoryManipulation;
