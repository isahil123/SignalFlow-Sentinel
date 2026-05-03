import { useSelector, useDispatch } from "react-redux";
import { fetchTargets } from "../../store/targetSlice";

const TargetList = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.targets);

  useEffect(() => {
    if (status === "idle") dispatch(fetchTargets("user-123"));
  }, [status, dispatch]);

  return (
    <div>
      {items.map((target) => (
        <TargetCard key={target.id} target={target} />
      ))}
    </div>
  );
};
