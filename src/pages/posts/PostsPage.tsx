import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostFilter from '../../components/Post/PostFilter';
import PostsList from '../../components/Post/PostsList';
import Pagination from '../../components/shared/Pagination/Pagination';
import SearchInput from '../../components/SearchInput';
import { PostServiceType, usePosts } from '../../hooks/usePosts';
import { PostStatus } from '../../types/post';

const PostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1', 10);


  const {
    posts,
    total,
    loading,
    error,
    setParams,
    refetch,
  } = usePosts(PostServiceType.DEFAULT, {
    page,
    limit: 12,
    sortField: searchParams.get('sortField') || 'publishDate',
    sortDirection: (searchParams.get('sortDirection') as 'ASC' | 'DESC') || 'ASC',
  }, '');

  const handleFilterChange = (key: string, value: any) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.set('page', '1');
      return newParams;
    });
    setParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value === '' ? undefined : value,
      },
    }));
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    setParams({
      page: 1,
      limit: 12,
      sortField: 'likes_count',
      sortDirection: 'ASC',
      filters: {},
      search: '',
    });
  };

  const handleSortChange = (field: string, direction: 'ASC' | 'DESC') => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sortField', field);
      newParams.set('sortDirection', direction);
      newParams.set('page', '1');
      return newParams;
    });
    setParams((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: direction,
    }));
  };

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  }, [searchParams]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row">
        <PostFilter
          query={{
            page,
            limit: 12,
            sortField: searchParams.get('sortField') || 'likes_count',
            sortDirection: (searchParams.get('sortDirection') as 'ASC' | 'DESC') || 'ASC',
            filters: {
              categories: searchParams.get('categories') || undefined,
              status: searchParams.get('status') as PostStatus || undefined,
            },
          }}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onResetFilters={resetFilters}
        />
        <div className="flex-1 p-4">
          <SearchInput
            searchInput={search}
            onSearchInputChange={(value) => setSearch(value)}
            onSearchKeyPress={(e) => {
              if (e.key === 'Enter') {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set('search', search);
                  newParams.set('page', '1');
                  return newParams;
                });
              }
            }}
          />
          {
            loading ? (
              <p className="mt-5 text-xl text-center text-gray-500">Loading...</p>
            ) : error ? (
              <div className="mt-5 text-xl text-center text-gray-500">
                <p>{error}</p>
                <button
                  className="mt-3 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                  onClick={refetch}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <PostsList posts={posts} />
                {total !== 0 && (
                  <Pagination
                    page={page}
                    total={total}
                    onPageChange={(newPage) => {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('page', String(newPage));
                        return newParams;
                      });
                    }}
                  />
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
