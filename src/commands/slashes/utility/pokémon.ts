import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

interface NamedAPIResource {
  /** The name of the referenced resource. */
  readonly name: string;
  /** The URL of the referenced resource. */
  readonly url: string;
}

interface VersionGameIndex {
  /** The internal id of an API resource within game data. */
  readonly game_index: number;
  /** The version relevent to this game index. */
  version: NamedAPIResource;
}

/**
 * Pokémon are the creatures that inhabit the world of the Pokémon games. They can be
 * caught using Pokéballs and trained by battling with other Pokémon. Each Pokémon
 * belongs to a specific species but may take on a variant which makes it differ from other
 * Pokémon of the same species, such as base stats, available abilities and typings.
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_(species) Bulbapedia} for greater detail.
 */
export interface Pokemon {
  /** The identifier for this resource. */
  readonly id: number;
  /** The name for this resource. */
  readonly name: string;
  /** The base experience gained for defeating this Pokémon. */
  readonly base_experience: number;
  /** The height of this Pokémon in decimeters. */
  readonly height: number;
  /** Set for exactly one Pokémon used as the default for each species. */
  readonly is_default: boolean;
  /** Order for sorting. Almost national order, except families are grouped together. */
  readonly order: number;
  /** The weight of this Pokémon in hectograms. */
  readonly weight: number;
  /** A list of abilities this Pokémon could potentially have. */
  abilities: PokemonAbility[];
  /** A list of forms this Pokémon can take on. */
  forms: NamedAPIResource[];
  /** A list of game indices relevent to Pokémon item by generation. */
  game_indices: VersionGameIndex[];
  /** A list of items this Pokémon may be holding when encountered. */
  held_items: PokemonHeldItem[];
  /**
   * A link to a list of location areas, as well as encounter details pertaining to specific
   * versions.
   */
  readonly location_area_encounters: string;
  /**
   * A list of moves along with learn methods and level details pertaining to specific version
   * groups.
   */
  moves: PokemonMove[];
  /** A list of details showing types this pokémon had in previous generations */
  past_types: PokemonTypePast[];
  /**
   * A set of sprites used to depict this Pokémon in the game. A visual representation of the
   * various sprites can be found at {@link https://github.com/PokeAPI/sprites#sprites PokeAPI/sprites}.
   */
  sprites: PokemonSprites;
  /** The species this Pokémon belongs to. */
  species: NamedAPIResource;
  /** A list of base stat values for this Pokémon. */
  stats: PokemonStat[];
  /** A list of details showing types this Pokémon has. */
  types: PokemonType[];
}

interface PokemonAbility {
  /** Whether or not this is a hidden ability. */
  readonly is_hidden: boolean;
  /** The slot this ability occupies in this Pokémon species. */
  readonly slot: number;
  /** The ability the Pokémon may have. */
  ability: NamedAPIResource;
}

interface PokemonType {
  /** The order the Pokémon's types are listed in. */
  readonly slot: number;
  /** The type the referenced Pokémon has. */
  type: NamedAPIResource;
}

interface PokemonTypePast {
  /** The last generation in which the referenced pokémon had the listed types. */
  generation: NamedAPIResource;
  /** The types the referenced pokémon had up to and including the listed generation. */
  types: PokemonType[];
}

interface PokemonHeldItem {
  /** The item the referenced Pokémon holds. */
  item: NamedAPIResource;
  /** The details of the different versions in which the item is held. */
  version_details: PokemonHeldItemVersion[];
}

interface PokemonHeldItemVersion {
  /** The version in which the item is held. */
  version: NamedAPIResource;
  /** How often the item is held. */
  readonly rarity: number;
}

interface PokemonMove {
  /** The move the Pokémon can learn. */
  move: NamedAPIResource;
  /** The details of the version in which the Pokémon can learn the move. */
  version_group_details: PokemonMoveVersion;
}

interface PokemonMoveVersion {
  /** The method by which the move is learned. */
  move_learn_method: NamedAPIResource;
  /** The version group in which the move is learned. */
  version_group: NamedAPIResource;
  /** The minimum level to learn the move. */
  readonly level_learned_at: number;
}

interface PokemonStat {
  /** The stat the Pokémon has. */
  stat: NamedAPIResource;
  /** The effort points (EV) the Pokémon has in the stat. */
  readonly effort: number;
  /** The base value of the stat. */
  readonly base_stat: number;
}

interface PokemonSprites {
  /** The default depiction of this Pokémon from the front in battle. */
  readonly front_default: string;
  /** The shiny depiction of this Pokémon from the front in battle. */
  readonly front_shiny: string;
  /** The female depiction of this Pokémon from the front in battle. */
  readonly front_female: string;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  readonly front_shiny_female: string;
  /** The default depiction of this Pokémon from the back in battle. */
  readonly back_default: string;
  /** The shiny depiction of this Pokémon from the back in battle. */
  readonly back_shiny: string;
  /** The female depiction of this Pokémon from the back in battle. */
  readonly back_female: string;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  readonly back_shiny_female: string;
}

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('pokémon')
    .setDescription('Search the PokéAPI for a given Pokémon')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('The name of Pokémon to search for')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('form')
      .setDescription('The Pokémon\'s regional form')
      .setChoices(
        {
          name: 'Alolan',
          value: '-alola',
        },
        {
          name: 'Galarian',
          value: '-galar',
        },
        {
          name: 'Hisuian',
          value: '-hisui',
        },
        {
          name: 'Paldean',
          value: '-paldea',
        },
        {
          name: 'Mega',
          value: '-mega',
        },
        {
          name: 'Mega X',
          value: '-mega-x',
        },
        {
          name: 'Mega Y',
          value: '-mega-y',
        },
        {
          name: 'Primal',
          value: '-primal',
        },
      ))
    .addBooleanOption((option) => option
      .setName('shiny')
      .setDescription('Whether to display a shiny version of the pokemon')),
  async execute(interaction) {
    /**
     * Capitalizes the first letter of the word/s.
     *
     * @param {string} words The word/s to capitalize.
     * @returns {string} The capitalized word/s.
     */
    function capitalize(words: string): string {
      return words
        .split(' ')
        .map((word) => word
          .charAt(0)
          .toUpperCase() + word.substring(1))
        .join(' ');
    }

    const givenPokémon = interaction.options.getString('name');
    const chosenForm = interaction.options.getString('form') ?? '';
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${givenPokémon}${chosenForm}`);

    if (response.statusText === 'Not Found') {
      return interaction.reply({
        content: `There was no entry found for \`${givenPokémon}${chosenForm}\`.`,
        ephemeral: true,
      });
    }

    const pokémon = await response.json() as Pokemon;
    const shiny = interaction.options.getBoolean('shiny');

    const pokédexEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle(`#${pokémon.id}${chosenForm === ''
        ? ': '
        : ' (PokéAPI): '} ${capitalize(pokémon.name.replace(chosenForm, ''))}`)
      .setThumbnail(shiny === true
        ? pokémon.sprites.front_shiny
        : pokémon.sprites.front_default)
      .addFields(
        {
          name: 'Type/s',
          value: pokémon.types
            .map((type) => capitalize(type.type.name))
            .join(', '),
        },
        {
          name: 'Height',
          value: `${pokémon.height / 10} m`,
          inline: true,
        },
        {
          name: 'Weight',
          value: `${pokémon.weight / 10} kg`,
          inline: true,
        },
        {
          name: 'Base Experience',
          value: `${pokémon.base_experience ?? '\u200B'}`,
        },
        {
          name: 'HP',
          value: pokémon.stats[0].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Attack',
          value: pokémon.stats[1].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Defense',
          value: pokémon.stats[2].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Special Attack',
          value: pokémon.stats[3].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Special Defense',
          value: pokémon.stats[4].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Speed',
          value: pokémon.stats[5].base_stat.toString(),
          inline: true,
        },
        {
          name: 'Ability/ies',
          value: pokémon.abilities
            .map((ability) => ability.is_hidden === true
              ? capitalize(ability.ability.name.replace('-', ' ')) + ' (Hidden)'
              : capitalize(ability.ability.name.replace('-', ' ')))
            .join(', '),
        },
        {
          name: 'Games Obtainable In',
          value: pokémon.game_indices.length >= 1
            ? pokémon.game_indices
              .map((game) => capitalize(game.version.name.replace('-', ' ')))
              .join(', ')
            : '\u200B',
        },
      );

    return interaction.reply({ embeds: [pokédexEmbed] });
  },
};
