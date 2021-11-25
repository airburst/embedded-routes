import { Flex, Text } from "@simplybusiness/mobius-simplybusiness";
import { PAGES } from "./routeState";

const Navbar = ({ state }) => {
  const activeStyle = {
    fontWeight: 700,
    backgroundColor: "white",
    boxShadow: "inset 5px 0px 0px 0px #D91265",
  };
  const style = {
    color: "#767676",
  };

  return PAGES.map((page) => (
    <Flex
      key={page.name}
      alignItems="center"
      height={48}
      padding={16}
      sx={state?.value === page.name ? activeStyle : style}
    >
      <Text fontSize={24}>{page.name}</Text>
    </Flex>
  ));
};

export default Navbar;
