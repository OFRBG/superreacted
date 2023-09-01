import type { Meta, StoryObj } from "@storybook/react";

import { Block } from "./Block";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Block",
  component: Block,
} satisfies Meta<typeof Block>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="flex h-2 w-2">
        <Block {...args} />
      </div>
    );
  },
};
