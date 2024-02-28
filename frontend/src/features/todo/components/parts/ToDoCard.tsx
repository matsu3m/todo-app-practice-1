import { ToDo } from "@/src/features/todo/types";
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

type Props = {
  todo: ToDo;
};

const ToDoCard = ({ todo }: Props) => {
  return (
    <Card marginBottom={3}>
      <CardHeader>
        <Heading size="sm">{todo.title}</Heading>
      </CardHeader>

      <CardBody>
        <Text>{todo.description}</Text>
        <Text>{todo.dueDate}</Text>
        <Text>{todo.status}</Text>
      </CardBody>
    </Card>
  );
};

export default ToDoCard;
