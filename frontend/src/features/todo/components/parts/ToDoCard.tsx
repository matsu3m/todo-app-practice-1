import { ToDo } from "@/src/features/todo/types";
import { Card, CardBody, CardFooter, CardHeader, Heading, Text } from "@chakra-ui/react";

type Props = {
  todo: ToDo;
};

const ToDoCard = ({ todo }: Props) => {
  return (
    <Card marginBottom={3}>
      <CardHeader>
        <Heading size="sm">{todo.title}</Heading>
      </CardHeader>

      {todo.description && (
        <CardBody>
          <Text>{todo.description}</Text>
        </CardBody>
      )}

      {todo.dueDate && (
        <CardFooter>
          <Text>{todo.dueDate}</Text>
        </CardFooter>
      )}
    </Card>
  );
};

export default ToDoCard;
