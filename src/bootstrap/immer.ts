import { enableMapSet, setAutoFreeze } from 'immer';

function bootstrapImmer() {
  setAutoFreeze(false);
  enableMapSet();
}

export default bootstrapImmer;