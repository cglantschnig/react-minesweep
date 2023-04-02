import MineSweeper from './components/MineSweeper';

function App() {
  return (
    <div className="App">
      <MineSweeper bombCount={8} gridSize={10} />
    </div>
  );
}

export default App;
