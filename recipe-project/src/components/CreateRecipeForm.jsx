import React, { useState } from 'react';

const ALLERGENS = [
  { name: 'Dairy', color: '#FDE68A' },
  { name: 'Eggs', color: '#FACC15' },
  { name: 'Gluten', color: '#6EE7B7' },
  { name: 'Peanuts', color: '#F87171' },
  { name: 'Soy', color: '#A78BFA' },
];

const CreateRecipeForm = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const toggleAllergen = (allergen) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '600px', gap: '1.5rem' }}>
        
        {/* Recipe Name */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Recipe Name</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Ingredients */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Recipe Ingredients</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={4}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              resize: 'vertical',
              overflowY: 'auto',
            }}
          />
        </div>

        {/* Allergens */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '150px', fontWeight: 'bold' }}>Food Allergens</label>
            <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ALLERGENS.map(({ name, color }) => (
                <button
                  key={name}
                  onClick={() => toggleAllergen(name)}
                  style={{
                    backgroundColor: color,
                    padding: '6px 12px',
                    border: selectedAllergens.includes(name)
                      ? '2px solid black'
                      : '1px solid #ccc',
                    borderRadius: '999px',
                    cursor: 'pointer',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Allergens Display */}
          {selectedAllergens.length > 0 && (
            <div style={{ marginTop: '0.5rem', marginLeft: '150px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {selectedAllergens.map((a) => (
                <div
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  style={{
                    backgroundColor: '#eee',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #bbb',
                  }}
                >
                  {a} ✕
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recipe Description */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Recipe Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              resize: 'vertical',
              overflowY: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeForm;
