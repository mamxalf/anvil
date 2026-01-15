export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Actions',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'move_forward',
        },
        {
          kind: 'block',
          type: 'turn_left',
        },
        {
          kind: 'block',
          type: 'turn_right',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Control',
      colour: '120',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 4,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'controls_if',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '210',
      contents: [
        {
          kind: 'block',
          type: 'logic_compare',
        },
      ],
    },
  ],
}
