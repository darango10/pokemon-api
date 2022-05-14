import React, { FC, useState } from "react";
import { Layout } from "../../components/layouts";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { pokeApi } from "../../api";
import { Pokemon } from "../../interfaces/pokemon-list";
import { Button, Card, Container, Grid, Text } from "@nextui-org/react";
import Image from "next/image";
import { localFavorites } from "../../utils";

interface Props {
  pokemon: Pokemon;
}

const PokemonPage: NextPage<Props> = ({ pokemon }) => {
  // const [exists, setExists] = useState(
  //   localFavorites.existsPokemonInFavorites(pokemon.id)
  // );

  // const onToggleFavorite = () => {
  //   localFavorites.toggleFavorite(pokemon.id);
  //   setExists(!exists);
  // };

  return (
    <Layout title={pokemon.name}>
      <Grid.Container css={{ marginTop: "5px" }} gap={2}>
        <Grid xs={12} sm={4}>
          <Card hoverable css={{ padding: "30px" }}>
            <Card.Image
              src={
                pokemon.sprites.other?.dream_world?.front_default ||
                "/no-image.png"
              }
              alt={pokemon.name}
              width={140}
              height={"100%"}
              objectFit={"contain"}
            />
          </Card>
        </Grid>

        <Grid xs={12} sm={8}>
          <Card hoverable css={{ padding: "30px" }}>
            <Card.Header
              css={{ display: "flex", justifyContent: "space-between" }}
            >
              <Text color="white" h1 transform="capitalize">
                {pokemon.name}
              </Text>
              {/* <Button
                color={"gradient"}
                ghost={!exists}
                onClick={onToggleFavorite}
              >
                {exists ? "Remove from favorites" : "Add to favorites"}
              </Button> */}
            </Card.Header>
            <Card.Body>
              <Text size={30}>Sprites:</Text>
              <Container direction="row" display="flex" gap={0}>
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const pokemon151 = [...Array(151)].map((value, index) => `${index + 1}`);

  return {
    paths: pokemon151.map((id) => ({
      params: {
        id,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };

  const getPokemonInfo = async (id: string) => {
    try {
      const { data } = await pokeApi.get<Pokemon>(`/pokemon/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  };

  const pokemon = await getPokemonInfo(id);

  if (!pokemon) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      pokemon,
    },
    revalidate: 86400,
  };
};

export default PokemonPage;
