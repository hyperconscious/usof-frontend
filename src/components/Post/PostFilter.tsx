import { QueryOptions } from '../../types/query';
import DatePicker from 'react-datepicker';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CategoryService from '../../services/CategoryService';

const animatedComponents = makeAnimated();

interface PostFilterProps {
  query: QueryOptions;
  onFilterChange: (key: string, value: string) => void;
  onSortChange: (field: string, direction: 'ASC' | 'DESC') => void;
  onResetFilters: () => void;
}

interface Category {
  value: string;
  label: string;
}

const PostFilter: React.FC<PostFilterProps> = (props: PostFilterProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [options, setOptions] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    props.query.filters?.categories?.split(',').map((cat) => ({ value: cat, label: cat })) || [],
  );

  useEffect(() => {
    if (props.query.filters?.dateRange) {
      const [start, end] = props.query.filters.dateRange.split(',').map((date) => new Date(date));
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(new Date());
      setEndDate(undefined);
    }
  }, [props.query.filters?.dateRange]);

  const onChange = (dates: [any, any]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const formatDateTimeForMySQL = (date: Date) => {
        const pad = (num: number) => String(num).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const dateRange = `${formatDateTimeForMySQL(start)},${formatDateTimeForMySQL(end)}`;
      props.onFilterChange('dateRange', dateRange);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await CategoryService.getCategories({ page: 1, limit: 40 });
        const formattedOptions = categories.items.map((category) => ({
          value: category.title,
          label: category.title,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    selectedCategories.filter((cat: any) => cat.value != '');

    if (selectedCategories.length !== 0 && selectedCategories[0]?.value != '') {
      console.log(selectedCategories);
      props.onFilterChange('categories', selectedCategories.map((cat: any) => cat.value).join(','));
    }
    loadCategories();
  }, []);

  const handleCategoryChange = (selected: any) => {
    props.onFilterChange('categories', selected ? selected.value : '');
    setSelectedCategories(selected);
    if (selected !== null && selected.length > 0) {
      props.onFilterChange('categories', selected.map((cat: any) => cat.value).join(','));
    } else {
      props.onResetFilters();
    }
  }

  return (
    <aside className="p-4 border-b w-full md:w-1/4 mb-4 md:mb-0">
      <div className="flex flex-col md:block">
        <div className="mb-4 md:mb-8">
          <h2 className="text-lg font-bold mb-2">Sort by</h2>
          <div className="flex space-x-2">
            <select
              value={props.query.sortField}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                props.onSortChange(e.target.value, props.query.sortDirection ?? 'ASC')
              }
              className="w-1/2 p-2 border rounded-md"
            >
              <option value="likes_count">Likes</option>
              <option value="publishDate">Date</option>
              <option value="comments_count">Comments</option>
            </select>

            <select
              value={props.query.sortDirection}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                props.onSortChange(
                  props.query.sortField ?? '',
                  e.target.value as 'ASC' | 'DESC',
                )
              }
              className="w-1/2 p-2 border rounded-md"
            >
              <option value="ASC">Asc</option>
              <option value="DESC">Desc</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            Status:
            <select
              value={props.query.filters?.status ?? ''}
              onChange={(e) => props.onFilterChange('status', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>
          </label>

          <p className='mb-2'>Date Range:</p>
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date range"
            className="w-full p-2 border rounded-md"
          />

          <div>
            <Select
              options={options}
              closeMenuOnSelect={false}
              isMulti
              placeholder="Search and select categories"
              components={animatedComponents}
              value={selectedCategories[0]?.value !== '' ? selectedCategories : []}
              onChange={handleCategoryChange}
              className="basic-multi-select mt-5"
              classNamePrefix="select"
            />
          </div>
        </div>

        <button
          onClick={props.onResetFilters}
          className="mt-4 p-2 bg-gray-700 text-white rounded-md w-24 hover:bg-gray-800"
        >
          Reset
        </button>

      </div>
    </aside >
  );
};

export default PostFilter;
