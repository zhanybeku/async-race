import { useState, useEffect, useRef, useCallback } from "react";
import "./garage.css";
import CarIcon from "../../assets/garage/car-top-view.svg?react";
import {
  resetCarPosition,
  startCarAnimation,
} from "../../utils/startCarAnimation";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createWinner,
  createCar,
  deleteCar,
  driveEngine,
  getCars,
  getWinner,
  startStopEngine,
  updateWinner,
  updateCar,
} from "../../api/api";

import type { Car, CreateCar } from "../../ts/interfaces";

const CARS_PER_PAGE = 10;
type SuccessfulRaceResult = { id: number; time: number };
type RaceAnnouncement = { name: string; time: number };

interface GarageProps {
  onRaceFinish: () => void;
}

const Garage = ({ onRaceFinish }: GarageProps) => {
  // The cars state
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // The new car's states
  const [newCarColor, setNewCarColor] = useState("#000000");
  const [newCarName, setNewCarName] = useState<string>("");

  // The states for the car that's being edited or deleted
  const [editId, setEditId] = useState<number | null>(null);
  const [editCarName, setEditCarName] = useState<string>("");
  const [editCarColor, setEditCarColor] = useState<string>("#000000");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // States for engine and driving
  const [racingIds, setRacingIds] = useState<Set<number>>(new Set());
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());
  const [raceAnnouncement, setRaceAnnouncement] = useState<RaceAnnouncement | null>(
    null,
  );

  const carRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const totalPages = Math.max(1, Math.ceil(totalCount / CARS_PER_PAGE));
  const shownCarsCount = cars.length;

  const loadCars = useCallback((pageNum: number) =>
    getCars({ _page: pageNum, _limit: CARS_PER_PAGE }).then(
      ({ cars, totalCount }) => {
        const total = totalCount ?? 0;

        if (cars.length === 0 && pageNum > 1) {
          setPage(pageNum - 1);
          return;
        }

        setCars(cars);
        setTotalCount(total);
      },
    ), []);

  useEffect(() => {
    loadCars(page);
  }, [page, loadCars]);

  // Car editing and creation
  const onCarClick = (id: number) => {
    setEditId(id);
    setEditCarName(cars.find((car) => car.id === id)?.name || "");
    setEditCarColor(cars.find((car) => car.id === id)?.color || "#000000");
  };

  const onSaveCar = (id: number) => {
    if (!editCarName.trim()) return;
    const updatedCar: CreateCar = { name: editCarName, color: editCarColor };
    updateCar(id, updatedCar).then(() => loadCars(page));
    setEditId(null);
  };

  const onCreateCar = () => {
    if (!newCarName.trim()) return;
    const newCar: CreateCar = { name: newCarName, color: newCarColor };
    createCar(newCar).then(() => loadCars(page));
    setNewCarName("");
    setNewCarColor("#000000");
  };

  const onSetToDelete = (id: number) => {
    setEditId(null);
    setEditCarName("");
    setEditCarColor("#000000");
    setDeleteId(id);
  };

  const onDeleteCar = (id: number) => {
    deleteCar(id).then(() => loadCars(page));
  };

  const fetchAllCars = async (): Promise<Car[]> => {
    const { cars, totalCount } = await getCars({ _page: 1, _limit: 1 });
    const total = totalCount ?? cars.length;

    if (total <= cars.length) return cars;

    const { cars: allCars } = await getCars({ _page: 1, _limit: total });
    return allCars;
  };

  const saveWinner = async (id: number, time: number) => {
    try {
      const existingWinner = await getWinner(id);
      await updateWinner(id, {
        wins: existingWinner.wins + 1,
        time: Math.min(existingWinner.time, time),
      });
    } catch {
      await createWinner({
        id,
        wins: 1,
        time,
      });
    }
  };

  const runCarRace = async (
    id: number,
  ): Promise<SuccessfulRaceResult | null> => {
    let racingAnimation: ReturnType<typeof startCarAnimation> | null = null;

    try {
      const { velocity, distance } = await startStopEngine(id, "started");
      const raceTime = distance / velocity / 1000;

      const carEl = carRefs.current[id];
      if (carEl) {
        await new Promise(requestAnimationFrame);
        racingAnimation = startCarAnimation(carEl, velocity, raceTime);
      }

      return await finishCarDrive(id, raceTime, racingAnimation);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("broken down")) {
        racingAnimation?.stop();
        setBrokenIds((prev) => new Set(prev).add(id));
      } else {
        console.error(error);
      }
      return null;
    }
  };

  const finishCarDrive = async (
    id: number,
    raceTime: number,
    racingAnimation: ReturnType<typeof startCarAnimation> | null,
  ): Promise<SuccessfulRaceResult | null> => {
    try {
      await driveEngine(id);

      setBrokenIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return { id, time: raceTime };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("broken down")) {
        racingAnimation?.stop();
        setBrokenIds((prev) => new Set(prev).add(id));
      } else {
        console.error(error);
      }
      return null;
    }
  };

  const onDriveCar = async (id: number) => {
    let shouldDrive = false;

    setRacingIds((prev) => {
      if (prev.has(id)) return prev;
      shouldDrive = true;
      return new Set(prev).add(id);
    });

    if (!shouldDrive) return;

    await runCarRace(id);
  };

  const resetCarUiState = (id: number) => {
    const carEl = carRefs.current[id];
    if (carEl) resetCarPosition(carEl);
    setRacingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setBrokenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const onResetCar = async (id: number) => {
    resetCarUiState(id);
    await startStopEngine(id, "stopped");
  };

  const onStartAll = async () => {
    const allCars = await fetchAllCars();
    setRaceAnnouncement(null);

    setRacingIds((prev) => {
      const next = new Set(prev);
      allCars.forEach((car) => next.add(car.id));
      return next;
    });

    const engineStarts = await Promise.all(
      allCars.map(async (car) => {
        try {
          const { velocity, distance } = await startStopEngine(car.id, "started");
          return {
            id: car.id,
            velocity,
            raceTime: distance / velocity / 1000,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      }),
    );

    const startedCars = engineStarts.filter(
      (start): start is { id: number; velocity: number; raceTime: number } =>
        start !== null,
    );

    if (startedCars.length === 0) {
      setRacingIds(new Set());
      return;
    }

    setRacingIds((prev) => {
      const next = new Set(prev);
      const startedIds = new Set(startedCars.map((car) => car.id));
      allCars.forEach((car) => {
        if (!startedIds.has(car.id)) next.delete(car.id);
      });
      return next;
    });

    await new Promise(requestAnimationFrame);

    const racingAnimations = new Map<
      number,
      ReturnType<typeof startCarAnimation>
    >();

    startedCars.forEach(({ id, velocity, raceTime }) => {
      const carEl = carRefs.current[id];
      if (carEl) {
        racingAnimations.set(
          id,
          startCarAnimation(carEl, velocity, raceTime),
        );
      }
    });

    const [results] = await Promise.all([
      Promise.all(
        startedCars.map(({ id, raceTime }) =>
          finishCarDrive(id, raceTime, racingAnimations.get(id) ?? null),
        ),
      ),
      Promise.all(
        Array.from(racingAnimations.values()).map((animation) => animation.finished),
      ),
    ]);

    const successfulRuns = results.filter(
      (result): result is SuccessfulRaceResult => result !== null,
    );

    if (successfulRuns.length === 0) return;

    const winner = successfulRuns.reduce((best, current) =>
      current.time < best.time ? current : best,
    );

    const winnerTime = Number(winner.time.toFixed(2));
    await saveWinner(winner.id, winnerTime);
    onRaceFinish();

    const winningCar = allCars.find((car) => car.id === winner.id);
    if (winningCar) {
      setRaceAnnouncement({ name: winningCar.name, time: winnerTime });
    }
  };

  const onResetAll = async () => {
    setRaceAnnouncement(null);
    const allCars = await fetchAllCars();
    const allIds = allCars.map((car) => car.id);

    allIds.forEach((id) => {
      const carEl = carRefs.current[id];
      if (carEl) resetCarPosition(carEl);
    });

    setRacingIds((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => next.delete(id));
      return next;
    });
    setBrokenIds((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => next.delete(id));
      return next;
    });

    await Promise.allSettled(allIds.map((id) => startStopEngine(id, "stopped")));
  };

  return (
    <div>
      <div className="buttons-container">
        <div className="race-buttons">
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{ backgroundColor: "var(--red)" }}
            onClick={onStartAll}
            disabled={racingIds.size > 0}
          >
            START
          </Button>

          <Button
            variant="contained"
            startIcon={<ReplayIcon />}
            sx={{ backgroundColor: "var(--blue)" }}
            onClick={onResetAll}
          >
            RESET
          </Button>

          <span className="hover-text">
            Click a car's name to edit or delete it!
          </span>
        </div>

        <div className="car-creation-buttons">
          <TextField
            label="Car name"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiInputBase-input": {
                backgroundColor: "white",
                borderRadius: "4px",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                backgroundColor: "white",
                padding: "0 7px",
                marginLeft: "-4px",
                borderRadius: "4px",
              },
            }}
            value={newCarName}
            onChange={(e) => setNewCarName(e.target.value)}
          />

          <input
            type="color"
            className="color-picker"
            value={newCarColor}
            onChange={(e) => setNewCarColor(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--green)" }}
            onClick={onCreateCar}
          >
            CREATE
          </Button>
        </div>
      </div>

      <table className="racetrack-table">
        <tbody>
          {cars.map((car, index) => (
            <tr key={car.id}>
              <td className="start-zone">
                <div className="start-zone-div">
                  <div className="individual-car-buttons">
                    <Button
                      onClick={() => onDriveCar(car.id)}
                      disabled={racingIds.has(car.id)}
                      size="small"
                    >
                      <PlayArrowIcon fontSize="small" />
                    </Button>

                    <Button onClick={() => onResetCar(car.id)} size="small">
                      <ReplayIcon fontSize="small" />
                    </Button>
                  </div>

                  <div className="car-icon-slot">
                    <div
                      className={`car-icon-wrapper${
                        brokenIds.has(car.id) ? " car-icon-wrapper--broken" : ""
                      }${racingIds.has(car.id) ? " car-icon-wrapper--racing" : ""}`}
                      ref={(node) => {
                        carRefs.current[car.id] = node;
                      }}
                    >
                      <CarIcon
                        className="carIcon"
                        width={40}
                        height={40}
                        fill={car.color}
                        stroke="white"
                        strokeWidth={0.5}
                      />
                    </div>
                  </div>
                </div>
              </td>
              {index === 0 && (
                <td className="start-line" rowSpan={cars.length}>
                  START
                </td>
              )}

              <td className="track">
                {editId === car.id ? (
                  <div className="edit-car-container">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={editCarName}
                      onChange={(e) => setEditCarName(e.target.value)}
                      sx={{
                        "& .MuiInputBase-input": {
                          backgroundColor: "white",
                          borderRadius: "4px",
                        },
                      }}
                    />

                    <input
                      type="color"
                      className="color-picker"
                      value={editCarColor}
                      onChange={(e) => setEditCarColor(e.target.value)}
                    />

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--green)" }}
                      onClick={() => onSaveCar(car.id)}
                    >
                      SAVE
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--blue)" }}
                      onClick={() => setEditId(null)}
                    >
                      CANCEL
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--red)" }}
                      onClick={() => onSetToDelete(car.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                ) : deleteId === car.id ? (
                  <div className="delete-car-container">
                    <span>Are you sure you want to delete this car?</span>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--red)" }}
                      onClick={() => onDeleteCar(car.id)}
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
                ) : (
                  <span className="car-name" onClick={() => onCarClick(car.id)}>
                    {car.name}
                  </span>
                )}
              </td>

              {index === 0 && (
                <td className="finish-line" rowSpan={cars.length}>
                  FINISH
                </td>
              )}

              <td className="finish-zone"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="garage-pagination">
        <div className="garage-pagination__controls">
          <Button
            size="small"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeftIcon fontSize="small" />
          </Button>

          <span className="garage-pagination__page">{page} / {totalPages}</span>

          <Button
            size="small"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <ChevronRightIcon fontSize="small" />
          </Button>
        </div>

        <span className="garage-pagination__total">
          {shownCarsCount} of {totalCount} total cars
        </span>
      </div>

      <Snackbar
        open={raceAnnouncement !== null}
        autoHideDuration={6000}
        onClose={() => setRaceAnnouncement(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "38% !important",
          left: "50% !important",
          right: "auto !important",
          transform: "translateX(-50%) !important",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setRaceAnnouncement(null)}
          sx={{
            minWidth: 360,
            py: 2.5,
            px: 4,
            fontSize: "1.35rem",
            fontWeight: 600,
            alignItems: "center",
            boxShadow: 6,
          }}
        >
          {raceAnnouncement
            ? `Winner: ${raceAnnouncement.name} — ${raceAnnouncement.time}s`
            : ""}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Garage;
