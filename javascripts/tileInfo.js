Tile.TYPES = {
  ROAD: Symbol("ROAD"),
  CITY: Symbol("CITY"),
  TERMINATOR: Symbol("TERMINATOR"),
  CLOISTER: Symbol("CLOISTER"),
  FIELD: Symbol("FIELD")
};

Tile.FRAMES = {
  A: 1,
  B: 0,
  C: 2,
  D: 23,
  E: 15,
  F: 12,
  G: 11,
  H: 14,
  I: 13,
  J: 17,
  K: 16,
  L: 18,
  M: 8,
  N: 7,
  O: 10,
  P: 9,
  Q: 4,
  R: 3,
  S: 6,
  T: 5,
  U: 19, 
  V: 20,
  W: 21,
  X: 22
}

Tile.KINDS = {
  B: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.FIELD },
  A: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  C: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.CITY,  typeLeft: Tile.TYPES.CITY  },
  R: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  Q: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  T: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  S: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  N: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  M: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  P: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  O: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  G: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  F: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  I: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  H: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.CITY,  typeLeft: Tile.TYPES.FIELD },
  E: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.FIELD },
  K: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  J: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  L: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  U: { typeTop: Tile.TYPES.ROAD,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  V: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  W: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  X: { typeTop: Tile.TYPES.ROAD,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  D: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.ROAD  }
};