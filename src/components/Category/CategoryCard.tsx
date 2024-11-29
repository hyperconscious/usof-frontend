import React, { useState } from 'react';
import { User } from '../../types/user';
import { Category } from '../../types/category';
import { UpdateCategoryData } from '../../validation/schemas';
import CategoryManipulation from './CategoryManipulation';

interface CategoryCardProps {
    category: Category;
    user: User;
    setShowButton?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, user, setShowButton }) => {
    const [isHidden, setIsHidden] = useState(false);
    const [isEditing, setIsEditing] = useState(category.id === -1 || false);
    const [data, setData] = useState<UpdateCategoryData>({ title: category.title, description: category.description });

    const hideCategory = () => {
        setIsHidden(true);
        setShowButton && setShowButton(true);
    };

    const updateCategory = (updatedContent: UpdateCategoryData) => {
        setData(updatedContent);
        setShowButton && setShowButton(true);
    };

    const getData = () => {
        return data;
    }

    if (isHidden) {
        return null;
    }

    return (
        isHidden ? null : (
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg">
                {isEditing ? (
                    <div>
                        <textarea
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                        />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                            rows={7}
                            style={{ resize: 'none' }}
                        />
                    </div>
                ) : (<>
                    <h2 className="text-lg font-semibold text-blue-500">{data.title}</h2>
                    <p className="text-sm text-gray-600 mt-2">{data.description}</p>
                </>
                )}
                <CategoryManipulation
                    category={category}
                    user={user}
                    isEditing={isEditing}
                    getData={getData}
                    hideCategory={hideCategory}
                    updateCategory={updateCategory}
                    setIsEditing={setIsEditing}
                />
            </div>
        )
    );
}
export default CategoryCard;
