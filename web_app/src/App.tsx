import {defineComponent} from 'vue';
import HelloWorld from './components/HelloWorld.tsx';

const App = defineComponent({
    render() {
        return (
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" class="logo" alt="Vite logo"/>
                </a>
                <a href="https://vuejs.org/" target="_blank">
                    <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
                </a>
                <HelloWorld msg="Vite + Vue"/>
            </div>
        );
    },
});

export default App;
