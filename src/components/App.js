import { useEffect, useState } from "react";
import FoodList from "./FoodList";
import { getFoods } from "../api";

const LIMIT = 10;

function App() {
  const [order, setOrder] = useState("createdAt");
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState("");

  const handleNewestClick = () => setOrder("createdAt");

  const handleCalorieClick = () => setOrder("calorie");

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    const {
      foods,
      paging: { nextCursor },
    } = await getFoods(options);
    if (!options.cursor) {
      setItems(foods);
    } else {
      setItems((prevItems) => [...prevItems, ...foods]);
    }
    setCursor(nextCursor);
  };

  const handleLoadMore = () => {
    handleLoad({ order, cursor });
  };

  useEffect(() => {
    handleLoad({ order });
  }, [order]);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  return (
    <div>
      <button onClick={handleNewestClick}>최신순</button>
      <button onClick={handleCalorieClick}>칼로리순</button>
      <FoodList items={sortedItems} onDelete={handleDelete} />
      {cursor && <button onClick={handleLoadMore}>더 보기</button>}
    </div>
  );
}

export default App;
