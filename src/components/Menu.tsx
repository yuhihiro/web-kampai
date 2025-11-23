import React, { useState } from 'react';
import { menuData } from '../data/menuData';
import { useOrderStore } from '../store/orderStore';

// Componente de Item do Menu com design moderno
const MenuItem: React.FC<{
  name: string;
  price?: number;
  ingredients?: string;
  onSelect: () => void;
  isSelected: boolean;
  disabled?: boolean;
}> = ({ name, price = 0, ingredients, onSelect, isSelected, disabled }) => (
  <div 
    onClick={onSelect}
    className={`group relative bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${
      isSelected 
        ? 'border-red-500 shadow-red-900/30 scale-[1.02]' 
        : 'border-neutral-800 hover:border-red-400 hover:scale-[1.01]'
    } ${disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}
  >
    {/* Imagem de fundo com overlay */}
    <div className="relative h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">
          {name.includes('Salmão') ? '🍣' : name.includes('Frango') ? '🍗' : name.includes('Camarão') ? '🍤' : '🥢'}
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
          <div className="text-sm font-bold">✓</div>
        </div>
      )}
    </div>
    
    {/* Conteúdo do Card */}
    <div className="p-6 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white text-xl leading-tight group-hover:text-red-400 transition-colors">
          {name}
        </h4>
        {price > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
            R$ {price.toFixed(2)}
          </div>
        )}
      </div>
      
      {ingredients && (
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
          {ingredients}
        </p>
      )}
      
      <div className="pt-3 border-t border-gray-100">
        <div className={`text-sm font-semibold transition-colors ${
          isSelected ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'
        }`}>
          {isSelected ? '✅ Item selecionado' : '👆 Clique para selecionar'}
        </div>
      </div>
    </div>
    
    {/* Efeito de brilho no hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  </div>
);

// Componente de Seção do Cardápio
const MenuSection: React.FC<{
  title: string;
  icon: string;
  subtitleRight?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, subtitleRight, children }) => (
  <div className="mb-12">
    <div className="flex items-center mb-6">
      <div className="text-3xl mr-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent ml-6"></div>
      {subtitleRight && (
        <div className="ml-4 text-sm text-gray-600 font-semibold">{subtitleRight}</div>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

export const Menu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poke' | 'temaki'>('poke');
  const { items, addItem, removeItem } = useOrderStore();

  const SECTION_RULES: Record<string, { key: 'base1' | 'proteina' | 'acompanhamentos' | 'molhos'; max: number }> = {
    'Base (escolha 1):': { key: 'base1', max: 1 },
    'Proteína (escolha 1):': { key: 'proteina', max: 1 },
    'Acompanhamentos (escolha 5 sem repetir):': { key: 'acompanhamentos', max: 5 },
    'Molhos (escolha 2):': { key: 'molhos', max: 2 },
  };

  type SelectedPoke = { base1: string | null; proteina: string | null; acompanhamentos: string[]; molhos: string[] };
  const [selectedPoke, setSelectedPoke] = useState<SelectedPoke>({
    base1: null,
    proteina: null,
    acompanhamentos: [],
    molhos: [],
  });

  const handleSelectItem = (name: string, category: string, price: number = 0) => {
    const rule = SECTION_RULES[category];
    if (!rule) {
      addItem({ name, category, price });
    } else {
      if (rule.max === 1) {
        const current = selectedPoke[rule.key];
        if (current === name) {
          // desmarcar
          const found = items.find((it) => it.name === name && it.category === category);
          if (found) removeItem(found.id);
          setSelectedPoke({ ...selectedPoke, [rule.key]: null });
        } else {
          // substituir seleção
          const prev = selectedPoke[rule.key];
          if (prev) {
            const prevItem = items.find((it) => it.name === prev && it.category === category);
            if (prevItem) removeItem(prevItem.id);
          }
          addItem({ name, category, price });
          setSelectedPoke({ ...selectedPoke, [rule.key]: name });
        }
      } else {
        const list = selectedPoke[rule.key] as string[];
        const exists = list.includes(name);
        if (exists) {
          const found = items.find((it) => it.name === name && it.category === category);
          if (found) removeItem(found.id);
          setSelectedPoke((prev) => ({
            ...prev,
            [rule.key]: (prev[rule.key] as string[]).filter((n) => n !== name),
          } as SelectedPoke));
        } else if (list.length < rule.max) {
          addItem({ name, category, price });
          setSelectedPoke((prev) => ({
            ...prev,
            [rule.key]: [...(prev[rule.key] as string[]), name],
          } as SelectedPoke));
        }
      }
    }

    const element = document.querySelector(`[data-item-name="${name}"]`);
    if (element) {
      element.classList.add('animate-slideIn');
      setTimeout(() => element.classList.remove('animate-slideIn'), 300);
    }
  };

  const isItemSelected = (itemName: string, category?: string) => {
    const rule = category ? SECTION_RULES[category] : undefined;
    if (rule) {
      if (rule.max === 1) {
        return selectedPoke[rule.key] === itemName;
      }
      const list = selectedPoke[rule.key] as string[];
      return list.includes(itemName);
    }
    return items.some((item) => item.name === itemName);
  };

  return (
    <div className="bg-neutral-900 rounded-3xl shadow-2xl p-8 animate-fadeIn border border-neutral-800 overflow-hidden text-white">
      {/* Sistema de Abas Moderno */}
      <div className="flex mb-10 bg-gray-50 rounded-2xl p-2 shadow-inner">
        <button
          onClick={() => setActiveTab('poke')}
          className={`relative flex-1 py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            activeTab === 'poke'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl transform scale-105'
              : 'text-gray-600 hover:text-red-600 hover:bg-white/50'
          }`}
        >
          <div className="text-2xl">🍱</div>
          <span>Poke Box</span>
          {activeTab === 'poke' && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('temaki')}
          className={`relative flex-1 py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            activeTab === 'temaki'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl transform scale-105'
              : 'text-gray-600 hover:text-red-600 hover:bg-white/50'
          }`}
        >
          <div className="text-2xl">🍙</div>
          <span>Temaki Box</span>
          {activeTab === 'temaki' && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
          )}
        </button>
      </div>

      {/* Conteúdo das Abas com Animação */}
      <div className="relative">
        <div className={`transition-all duration-500 ${activeTab === 'poke' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          {activeTab === 'poke' && (
            <div className="space-y-8">
              {menuData.pokeBox.sections.map((section, sectionIndex) => {
                const rule = SECTION_RULES[section.title];
                const subtitle = rule
                  ? rule.max === 1
                    ? selectedPoke[rule.key] ? '1/1 selecionado' : '0/1 selecionado'
                    : `${(selectedPoke[rule.key] as string[]).length}/${rule.max} selecionados`
                  : null;
                return (
                  <MenuSection
                    key={sectionIndex}
                    title={section.title}
                    icon={sectionIndex === 0 ? '🍚' : sectionIndex === 1 ? '🐟' : sectionIndex === 2 ? '🥗' : '🧂'}
                    subtitleRight={subtitle}
                  >
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} data-item-name={item}>
                        <MenuItem
                          name={item}
                          onSelect={() => handleSelectItem(item, section.title)}
                          isSelected={isItemSelected(item, section.title)}
                          disabled={(() => {
                            if (!rule || rule.max === 1) return false;
                            const list = selectedPoke[rule.key] as string[];
                            return list.length >= rule.max && !list.includes(item);
                          })()}
                        />
                      </div>
                    ))}
                  </MenuSection>
                );
              })}
            </div>
          )}
        </div>
        
        <div className={`transition-all duration-500 ${activeTab === 'temaki' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          {activeTab === 'temaki' && (
            <div className="space-y-8">
              <MenuSection title={menuData.temakiBox.title} icon="🍙">
                {menuData.temakiBox.items.map((item, index) => (
                  <div key={index} data-item-name={item.name}>
                    <MenuItem
                      name={item.name}
                      ingredients={item.ingredients}
                      price={15.90}
                      onSelect={() => handleSelectItem(item.name, 'Temaki', 15.90)}
                      isSelected={isItemSelected(item.name)}
                    />
                  </div>
                ))}
              </MenuSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};