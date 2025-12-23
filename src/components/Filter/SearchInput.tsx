import styles from './Filter.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchInput({ value, onChange, onClear }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="タイトルや詳細で検索..."
        value={value}
        onChange={handleChange}
        aria-label="スケジュール検索"
      />
      {value && (
        <button
          className={styles.searchClear}
          onClick={onClear}
          type="button"
          aria-label="検索をクリア"
        >
          ✕
        </button>
      )}
    </div>
  );
}
