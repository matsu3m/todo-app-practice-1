import { Flex } from "@chakra-ui/react";
import { DndContext, DragOverEvent, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { todoStatuses } from "../../constants";
import { ToDo, isToDoStatus } from "../../types";
import ToDoLane from "./ToDoLane";

type Props = {
  todos: ToDo[];
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoBoard = ({ todos, setTodos }: Props) => {
  const lanes = Object.entries(todoStatuses).map(([statusId, statusDisplayName]) => ({
    id: statusId,
    displayName: statusDisplayName,
    todos: todos.filter((todo) => todo.status === statusId),
  }));

  const findTodo = (id: string) => todos.find((todo) => todo.id === id);

  const getLane = (id: string | null) => {
    if (!id) {
      return null;
    }

    // over の対象がレーンの場合はそのまま返却
    if (isToDoStatus(id)) {
      return id;
    }

    // over の対象がカードの場合はそのカードが所属するレーンを返却
    const overedTodo = findTodo(id);
    return overedTodo?.status ?? null;
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeLane = getLane(activeId);
    const overLane = getLane(overId);
    const activeTodo = findTodo(activeId);

    if (!activeLane || !overLane || activeLane === overLane || !activeTodo) {
      return null;
    }

    const newStatus = overLane;

    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === activeId ? { ...todo, status: newStatus } : todo)));

    try {
      await fetch(`/api/todos/${activeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: activeTodo.title,
          description: activeTodo.description,
          dueDate: activeTodo.dueDate,
          status: newStatus,
        }),
      });
    } catch {
      // エラーが発生した場合は元の状態に戻す
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === activeId ? { ...todo, status: activeLane } : todo)));
    }
  };

  // distance　で指定した距離以上移動したら発火 (onClick イベントと共存させるため)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver}>
      <Flex justifyContent="space-between">
        {lanes.map((lane) => (
          <ToDoLane
            key={lane.id}
            laneId={lane.id}
            laneDisplayName={lane.displayName}
            todos={lane.todos}
            setTodos={setTodos}
          />
        ))}
      </Flex>
    </DndContext>
  );
};

export default ToDoBoard;
