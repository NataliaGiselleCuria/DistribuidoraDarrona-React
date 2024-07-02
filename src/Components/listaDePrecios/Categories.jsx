import React, { useContext } from 'react';
import { DataContext } from '../../Context/DataProvider';

const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory } = useContext(DataContext);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className='categories'>
      <ul>
        <li 
          key='TODOS LOS PRODUCTOS' 
          onClick={() => handleCategoryClick('TODOS LOS PRODUCTOS')}
          className={selectedCategory === 'TODOS LOS PRODUCTOS' ? 'selected' : ''}
        >
          TODOS LOS PRODUCTOS
        </li>
        {categories.map(category => (
          <li 
            key={category} 
            onClick={() => handleCategoryClick(category)}
            className={selectedCategory === category ? 'selected' : ''}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Categories;
