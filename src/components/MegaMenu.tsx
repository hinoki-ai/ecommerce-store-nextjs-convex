'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  tags: string;
}

interface MegaMenuProps {
  collections: Collection[];
}

export default function MegaMenu({ collections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group collections by category/tags for better organization
  const groupedCollections = collections.reduce((acc, collection) => {
    const tags = collection.tags.split(',').map(tag => tag.trim());
    const primaryTag = tags[0] || 'General';

    if (!acc[primaryTag]) {
      acc[primaryTag] = [];
    }
    acc[primaryTag].push(collection);
    return acc;
  }, {} as Record<string, Collection[]>);

  // Sort collections alphabetically within each group
  Object.keys(groupedCollections).forEach(key => {
    groupedCollections[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  const categoryKeys = Object.keys(groupedCollections).sort();

  return (
    <nav className="bg-white shadow-lg border-b">
      {/* Mobile Menu Button */}
      <div className="lg:hidden px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Desktop Mega Menu */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Luxury Store
              </Link>

              <div className="flex items-center space-x-6">
                {categoryKeys.slice(0, 8).map((category) => (
                  <div
                    key={category}
                    className="relative group"
                    onMouseEnter={() => setActiveCategory(category)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
                      <span>{category}</span>
                      <ChevronDown size={16} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {activeCategory === category && (
                      <div className="absolute top-full left-0 w-96 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {category} Collections
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            {groupedCollections[category].map((collection) => (
                              <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="group/item block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <h4 className="font-medium text-gray-900 group-hover/item:text-blue-600">
                                  {collection.name}
                                </h4>
                                {collection.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {collection.description}
                                  </p>
                                )}
                                <div className="text-xs text-gray-500 mt-2">
                                  {collection.tags.split(',').slice(0, 3).join(', ')}
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Link
                              href={`/categories/${category.toLowerCase()}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View all {category} →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-gray-900">
                Search
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {categoryKeys.map((category) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <div className="space-y-2 pl-4">
                  {groupedCollections[category].slice(0, 5).map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="block text-gray-700 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {collection.name}
                    </Link>
                  ))}
                  {groupedCollections[category].length > 5 && (
                    <Link
                      href={`/categories/${category.toLowerCase()}`}
                      className="block text-blue-600 hover:text-blue-800"
                      onClick={() => setIsOpen(false)}
                    >
                      View all {category} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}