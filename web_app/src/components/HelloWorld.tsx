import {defineComponent, PropType, ref} from 'vue';

export default defineComponent({
    props: {
        msg: {
            type: String as PropType<string>,
            required: true,
        },
    },
    setup() {
        const count = ref(0);

        return {count};
    },
    render() {
        return (
            <div>
                <h1>{this.msg}</h1>
                <div class="card">
                    <button type="button" onClick={() => this.count++}>
                        count is {this.count}
                    </button>
                    <p>
                        Edit <code>components/HelloWorld.tsx</code> to test HMR
                    </p>
                </div>
                <p>
                    Check out{' '}
                    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
                        create-vue
                    </a>
                    , the official Vue + Vite starter
                </p>
                <p>
                    Install{' '}
                    <a href="https://github.com/vuejs/language-tools" target="_blank">
                        Volar
                    </a>{' '}
                    in your IDE for a better DX
                </p>
                <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
            </div>
        );
    },
});
