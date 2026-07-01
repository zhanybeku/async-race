import { useCallback, useEffect, useState } from "react";
import "./winners.css";
import { getCars, getWinners, deleteWinner } from "../../api/api";
import type { Car, Winner } from "../../ts/interfaces";

import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";

type WinnerRow = Winner & { name: string };

const WINNERS_PER_PAGE = 10;

const fetchAllCars = async (): Promise<Car[]> => {
  const { cars, totalCount } = await getCars({ _page: 1, _limit: 1 });
  const total = totalCount ?? cars.length;

  if (total <= cars.length) return cars;

  const { cars: allCars } = await getCars({ _page: 1, _limit: total });
  return allCars;
};

interface WinnersProps {
  winnersVersion: number;
}

const Winners = ({ winnersVersion }: WinnersProps) => {
  const [winners, setWinners] = useState<WinnerRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nameById, setNameById] = useState<Map<number, string>>(new Map());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / WINNERS_PER_PAGE));
  const shownWinnersCount = winners.length;

  useEffect(() => {
    fetchAllCars().then((cars) => {
      setNameById(new Map(cars.map((car) => [car.id, car.name])));
    });
  }, []);

  const loadWinners = useCallback(
    (pageNum: number) =>
      getWinners({
        _page: pageNum,
        _limit: WINNERS_PER_PAGE,
        _sort: "wins",
        _order: "DESC",
      }).then(({ winners, totalCount }) => {
        const total = totalCount ?? 0;

        if (winners.length === 0 && pageNum > 1) {
          setPage(pageNum - 1);
          return;
        }

        setWinners(
          winners.map((winner) => ({
            ...winner,
            name: nameById.get(winner.id) ?? `Car #${winner.id}`,
          })),
        );
        setTotalCount(total);
      }),
    [nameById],
  );

  useEffect(() => {
    loadWinners(page);
  }, [page, loadWinners, winnersVersion]);

  const onSetToDelete = (id: number) => {
    setDeleteId(id);
  };

  const onDeleteWinner = (id: number) => {
    deleteWinner(id).then(() => {
      setDeleteId(null);
      loadWinners(page);
    });
  };

  return (
    <div className="winners">
      <table className="winners-table">
        <colgroup>
          <col className="winners-table__col winners-table__col--rank" />
          <col className="winners-table__col winners-table__col--car" />
          <col className="winners-table__col winners-table__col--wins" />
          <col className="winners-table__col winners-table__col--time" />
          <col className="winners-table__col winners-table__col--actions" />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>Car</th>
            <th>Wins</th>
            <th>Best time (s)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {winners.length === 0 ? (
            <tr>
              <td colSpan={5} className="winners-table__empty">
                No winners yet
              </td>
            </tr>
          ) : (
            winners.map((winner, index) => (
              <tr key={winner.id}>
                <td>{(page - 1) * WINNERS_PER_PAGE + index + 1}</td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time.toFixed(2)}</td>
                <td>
                  {deleteId === winner.id ? (
                    <div className="delete-winner-container">
                      <span>Are you sure?</span>
                      <div className="delete-winner-container__buttons">
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--red)" }}
                          onClick={() => onDeleteWinner(winner.id)}
                        >
                          YES
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--blue)" }}
                          onClick={() => setDeleteId(null)}
                        >
                          NO
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--red)" }}
                      onClick={() => onSetToDelete(winner.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="winners-pagination">
        <div className="winners-pagination__controls">
          <Button
            size="small"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeftIcon fontSize="small" />
          </Button>

          <span className="winners-pagination__page">
            {page} / {totalPages}
          </span>

          <Button
            size="small"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <ChevronRightIcon fontSize="small" />
          </Button>
        </div>

        <span className="winners-pagination__total">
          {shownWinnersCount} of {totalCount} total winners
        </span>
      </div>
    </div>
  );
};

export default Winners;
