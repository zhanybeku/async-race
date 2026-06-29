import { useEffect, useState } from "react";
import "./winners.css";
import { getCars, getWinners } from "../../api/api";
import type { Car, Winner } from "../../ts/interfaces";

type WinnerRow = Winner & { name: string };

const fetchAllCars = async (): Promise<Car[]> => {
  const { cars, totalCount } = await getCars({ _page: 1, _limit: 1 });
  const total = totalCount ?? cars.length;

  if (total <= cars.length) return cars;

  const { cars: allCars } = await getCars({ _page: 1, _limit: total });
  return allCars;
};

const Winners = () => {
  const [winners, setWinners] = useState<WinnerRow[]>([]);

  useEffect(() => {
    Promise.all([
      getWinners({ _sort: "wins", _order: "DESC" }),
      fetchAllCars(),
    ]).then(([{ winners }, cars]) => {
      const nameById = new Map(cars.map((car) => [car.id, car.name]));

      setWinners(
        winners.map((winner) => ({
          ...winner,
          name: nameById.get(winner.id) ?? `Car #${winner.id}`,
        })),
      );
    });
  }, []);

  return (
    <div className="winners">
      <table className="winners-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Car</th>
            <th>Wins</th>
            <th>Best time (s)</th>
          </tr>
        </thead>
        <tbody>
          {winners.length === 0 ? (
            <tr>
              <td colSpan={4} className="winners-table__empty">
                No winners yet
              </td>
            </tr>
          ) : (
            winners.map((winner, index) => (
              <tr key={winner.id}>
                <td>{index + 1}</td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Winners;
