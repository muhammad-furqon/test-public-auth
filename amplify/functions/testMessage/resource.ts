import { defineFunction } from "@aws-amplify/backend";

//Test message function definition
export const testMessage = defineFunction({
    name: 'test-message',
    entry: './handler.ts',
    //Give permissions to Todo
});

