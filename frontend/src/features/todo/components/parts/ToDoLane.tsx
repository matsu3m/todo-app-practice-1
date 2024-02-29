import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ToDo } from "../../types";
import ToDoCard from "./ToDoCard";

type Props = {
  laneId: string;
  laneDisplayName: string;
  todos: ToDo[];
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoLane = ({ laneId, laneDisplayName, todos, setTodos }: Props) => {
  const { setNodeRef } = useDroppable({ id: laneId });
  return (
    <SortableContext id={laneId} items={todos} strategy={rectSortingStrategy}>
      <Card backgroundColor="gray.50" width={80} ref={setNodeRef}>
        <CardHeader>
          <Heading size="sm">{laneDisplayName}</Heading>
        </CardHeader>

        <CardBody>
          {todos.map((todo) => (
            <ToDoCard key={todo.id} id={todo.id} todo={todo} setTodos={setTodos} />
          ))}
        </CardBody>
      </Card>
    </SortableContext>
  );
};

export default ToDoLane;
