import { Flex, Loading } from '@paalan/react-ui';

const LoadingComponent = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Loading className="size-5" content="Loading..." />
    </Flex>
  );
};

export default LoadingComponent;
