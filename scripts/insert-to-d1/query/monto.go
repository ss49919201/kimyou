package query

import (
	"strconv"
	"time"

	sqlbuilder "github.com/huandu/go-sqlbuilder"
)

type Monto struct {
	ID          string
	FirstName   string
	LastName    string
	Address     string
	DateOfDeath string
}

func CreateManyMontos(montos []Monto) (string, []any) {
	ib := sqlbuilder.NewInsertBuilder()
	ib.InsertInto("montos")
	ib.Cols(
		"id",
		"first_name",
		"last_name",
		"address",
		"date_of_death",
		"created_at",
		"updated_at",
	)

	for _, monto := range montos {
		ib.Values(
			strconv.FormatInt(time.Now().UnixNano(), 10),
			monto.FirstName,
			monto.LastName,
			monto.Address,
			monto.DateOfDeath,
			sqlbuilder.Raw("NOW()"),
			sqlbuilder.Raw("NOW()"),
		)
	}

	return ib.Build()
}
