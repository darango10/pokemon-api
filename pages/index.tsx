import type { NextPage } from "next";
import { Layout } from "../components/layouts";
import { pokeApi } from "../api";
import {
  PokemonList,
  PokemonListResponse,
  Pokemon,
} from "../interfaces/pokemon-list";
import {
  Card,
  Grid,
  Row,
  Text,
  Pagination,
  Button,
  Container,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// interface Props {
//   pokemons: PokemonList[];
// }

const Home: NextPage = () => {
  const [pokes, setPokes] = useState<PokemonList[]>([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async (init: boolean = false) => {
    if (init) {
      setPage(1);
    }

    setLoading(true);
    const { data } = await pokeApi.get<PokemonListResponse>(
      `/pokemon?limit=10&offset=${page * 10 - 10}`
    );
    setTotal(data.count);
    const pokemons = data.results.map(async (pokemon, i) => {
      const { data } = await pokeApi.get<Pokemon>(`/pokemon/${pokemon.name}`);

      return {
        name: pokemon.name,
        url: pokemon.url,
        id: pokemon.url.split("/")[pokemon.url.split("/").length - 2],
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(
          pokemon.url.split("/")[pokemon.url.split("/").length - 2]
        )}.png`,
        moves: data.moves.map((move) => move.move.name),
      };
    });

    setPokes(await Promise.all(pokemons));
    setLoading(false);
  };

  useEffect(() => {
    if (pokes.length > 0) {
      fetchPokemons();
    }
  }, [page]);

  const onPokemonClick = (id: number) => {
    router.push(`/pokemon/${id}`);
  };

  return (
    <>
      <Layout title="Listado de Pokemón">
        <Container
          xl
          css={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <Button onClick={() => fetchPokemons(true)}>Load Pokes</Button>
        </Container>
        {!loading ? (
          <Grid.Container gap={2} justify={"flex-start"}>
            {pokes.map(({ id, name, img, moves }) => (
              <Grid
                xs={12}
                sm={6}
                md={3}
                xl={2}
                key={id}
                onClick={() => onPokemonClick(parseInt(id))}
              >
                <Card hoverable clickable>
                  <Card.Body css={{ p: 1 }}>
                    <Card.Image
                      src={img}
                      alt={name}
                      width={140}
                      height={"100%"}
                      objectFit={"contain"}
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Row justify="space-between">
                      <Text transform="capitalize">{name}</Text>
                      <Text>{id}</Text>
                    </Row>
                  </Card.Footer>
                  <Card.Footer>
                    <Row
                      css={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {moves.splice(0, 5).map((move, i) => (
                        <Text key={i} transform="capitalize">
                          {move}
                        </Text>
                      ))}
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            ))}
          </Grid.Container>
        ) : (
          <p>Loading...</p>
        )}
        {pokes.length > 0 && (
          <Container
            xl
            css={{ display: "flex", justifyContent: "center", margin: "10px" }}
          >
            <Pagination
              noMargin
              shadow
              total={Math.ceil(total / 10)}
              initialPage={1}
              page={page}
              onChange={(page) => setPage(page)}
            />
          </Container>
        )}
      </Layout>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const { data } = await pokeApi.get<PokemonListResponse>("/pokemon?limit=151");

//   const pokemons: PokemonList[] = data.results.map((pokemon, i) => ({
//     name: pokemon.name,
//     url: pokemon.url,
//     id: i + 1,
//     img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
//       i + 1
//     }.png`,
//   }));

//   return {
//     props: {
//       pokemons,
//     },
//   };
// };

export default Home;
